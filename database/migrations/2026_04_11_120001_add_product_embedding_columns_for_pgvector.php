<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('CREATE EXTENSION IF NOT EXISTS vector');

        $dimensions = (int) config('ai.product_embedding_dimensions', 1536);

        if (! Schema::hasColumn('products', 'embedding')) {
            DB::statement("ALTER TABLE products ADD COLUMN embedding vector({$dimensions})");
        }

        if (! Schema::hasColumn('products', 'embedding_model')) {
            DB::statement('ALTER TABLE products ADD COLUMN embedding_model varchar(120) NULL');
        }

        if (! Schema::hasColumn('products', 'embedded_at')) {
            DB::statement('ALTER TABLE products ADD COLUMN embedded_at timestamp NULL');
        }

        DB::statement('CREATE INDEX IF NOT EXISTS products_embedding_hnsw_idx ON products USING hnsw (embedding vector_cosine_ops)');
    }

    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('DROP INDEX IF EXISTS products_embedding_hnsw_idx');

        if (Schema::hasColumn('products', 'embedded_at')) {
            DB::statement('ALTER TABLE products DROP COLUMN embedded_at');
        }

        if (Schema::hasColumn('products', 'embedding_model')) {
            DB::statement('ALTER TABLE products DROP COLUMN embedding_model');
        }

        if (Schema::hasColumn('products', 'embedding')) {
            DB::statement('ALTER TABLE products DROP COLUMN embedding');
        }
    }
};
