<?php

namespace App\Console\Commands;

use App\Jobs\SyncProductEmbedding;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;

class ProductsEmbeddingsBackfillCommand extends Command
{
    protected $signature = 'products:embeddings-backfill {--chunk=50 : Products per dispatch batch}';

    protected $description = 'Queue embedding sync jobs for all products (PostgreSQL + pgvector only)';

    public function handle(): int
    {
        if (Schema::getConnection()->getDriverName() !== 'pgsql' || ! Schema::hasColumn('products', 'embedding')) {
            $this->error('PostgreSQL with products.embedding column is required.');

            return self::FAILURE;
        }

        $chunk = max(1, (int) $this->option('chunk'));
        $count = 0;
        $globalIndex = 0;

        Product::query()->orderBy('id')->chunkById($chunk, function ($products) use (&$count, &$globalIndex) {
            foreach ($products as $product) {
                $delaySeconds = min($globalIndex * 2, 600);
                SyncProductEmbedding::dispatch($product->id)->delay(now()->addSeconds($delaySeconds));
                $globalIndex++;
                $count++;
            }
        });

        $this->info("Queued {$count} embedding jobs. Run a queue worker to process them.");

        return self::SUCCESS;
    }
}
