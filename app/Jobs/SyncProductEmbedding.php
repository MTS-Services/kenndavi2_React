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

class SyncProductEmbedding implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 12;

    public function __construct(
        public int $productId,
    ) {}

    /**
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [20, 45, 90, 180, 300, 600];
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
            $pending = Embeddings::for([$text])->dimensions($dimensions);

            if (config('ai.caching.embeddings.cache', false)) {
                $pending = $pending->cache();
            }

            $response = $pending->generate();
            $vector = $response->first();
            $literal = $this->vectorLiteral($vector);
            $model = $response->meta->model;

            DB::update(
                'UPDATE products SET embedding = ?::vector, embedding_model = ?, embedded_at = ? WHERE id = ?',
                [$literal, $model, now(), $product->id]
            );
        } catch (\Throwable $e) {
            if ($this->isEmbeddingRateLimited($e)) {
                Log::notice('SyncProductEmbedding rate limited; releasing job', [
                    'product_id' => $this->productId,
                    'attempt' => $this->attempts(),
                    'message' => $e->getMessage(),
                ]);
                $this->release($this->releaseAfterSeconds());

                return;
            }

            Log::warning('SyncProductEmbedding failed', [
                'product_id' => $this->productId,
                'message' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    protected function releaseAfterSeconds(): int
    {
        $steps = [45, 90, 180, 300, 600, 900];
        $i = min(max($this->attempts() - 1, 0), count($steps) - 1);

        return $steps[$i] + random_int(5, 35);
    }

    protected function isEmbeddingRateLimited(\Throwable $e): bool
    {
        if ($e instanceof RequestException && $e->response !== null) {
            return $e->response->status() === 429;
        }

        $class = $e::class;
        if ($class === 'Laravel\\Ai\\Exceptions\\RateLimitedException') {
            return true;
        }

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
