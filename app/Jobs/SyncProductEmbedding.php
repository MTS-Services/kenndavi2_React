<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Client\RequestException;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Laravel\Ai\Embeddings;
use Laravel\Ai\Exceptions\RateLimitedException;

class SyncProductEmbedding implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(
        public int $productId,
    ) {}

    /**
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [30, 90, 180];
    }

    public function handle(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'pgsql' || ! Schema::hasColumn('products', 'embedding')) {
            return;
        }

        $product = Product::query()->with(['category', 'subcategory', 'tags'])->find($this->productId);

        if ($product === null) {
            return;
        }

        $text = $product->embeddingSourceText();

        if (trim($text) === '') {
            return;
        }

        try {
            $dimensions = (int) config('ai.product_embedding_dimensions', 1536);
            $model = (string) config('ai.product_embedding_model', 'text-embedding-3-small');
            $provider = config('ai.default_for_embeddings', 'openai');

            $pending = Embeddings::for([$text])->dimensions($dimensions);

            if (config('ai.caching.embeddings.cache', false)) {
                $pending = $pending->cache();
            }

            $response = $pending->generate($provider, $model);
            $vector = $response->first();
            $literal = $this->vectorLiteral($vector);
            $resolvedModel = $response->meta->model;

            DB::update(
                'UPDATE products SET embedding = ?::vector, embedding_model = ?, embedded_at = ? WHERE id = ?',
                [$literal, $resolvedModel, now(), $product->id]
            );
        } catch (\Throwable $e) {
            if ($this->isEmbeddingRateLimited($e)) {
                $this->handleRateLimited($e);

                return;
            }

            Log::warning('SyncProductEmbedding failed', [
                'product_id' => $this->productId,
                'message' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    protected function handleRateLimited(\Throwable $e): void
    {
        if ($this->attempts() >= $this->tries) {
            Log::warning('SyncProductEmbedding abandoned after max attempts (rate limited / 429)', [
                'product_id' => $this->productId,
                'attempts' => $this->attempts(),
                'configured_model' => config('ai.product_embedding_model'),
                'message' => $e->getMessage(),
            ]);
            $this->fail($e);

            return;
        }

        Log::notice('SyncProductEmbedding rate limited; releasing job', [
            'product_id' => $this->productId,
            'attempt' => $this->attempts(),
            'max_tries' => $this->tries,
            'configured_model' => config('ai.product_embedding_model'),
            'message' => $e->getMessage(),
        ]);
        $this->release($this->releaseAfterSeconds());
    }

    protected function releaseAfterSeconds(): int
    {
        $steps = [45, 120, 240];
        $i = min(max($this->attempts() - 1, 0), count($steps) - 1);

        return $steps[$i] + random_int(5, 25);
    }

    protected function isEmbeddingRateLimited(\Throwable $e): bool
    {
        if ($e instanceof RateLimitedException) {
            return true;
        }

        if ($e instanceof RequestException && $e->response !== null) {
            return $e->response->status() === 429;
        }

        $class = $e::class;
        if (str_contains($class, 'RateLimit') || str_contains($class, 'TooManyRequests')) {
            return true;
        }

        $prev = $e->getPrevious();
        if ($prev instanceof RequestException && $prev->response !== null) {
            return $prev->response->status() === 429;
        }

        $msg = strtolower($e->getMessage());

        return str_contains($msg, '429')
            || str_contains($msg, 'too many requests')
            || str_contains($msg, 'rate limit');
    }

    /**
     * @param  array<float>  $values
     */
    protected function vectorLiteral(array $values): string
    {
        return '['.implode(',', array_map(fn (mixed $v): string => (string) (float) $v, $values)).']';
    }
}
