<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Laravel\Ai\Embeddings;

class SyncProductEmbedding implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $productId,
    ) {}

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
            Log::warning('SyncProductEmbedding failed', [
                'product_id' => $this->productId,
                'message' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * @param  array<float>  $values
     */
    protected function vectorLiteral(array $values): string
    {
        return '['.implode(',', array_map(fn (mixed $v): string => (string) (float) $v, $values)).']';
    }
}
