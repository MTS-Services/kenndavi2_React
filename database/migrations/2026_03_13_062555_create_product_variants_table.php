<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('color_id')->constrained('colors');
            $table->foreignId('size_id')->constrained('sizes');

            $table->decimal('price', 10, 2);
            $table->decimal('offer_price', 10, 2)->nullable();
            $table->unsignedTinyInteger('offer_percent')->nullable();
            $table->timestamp('offer_starts_at')->nullable();
            $table->timestamp('offer_ends_at')->nullable();
            $table->integer('stock_quantity')->default(0);

            $table->string('status', 20)->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['product_id', 'color_id', 'size_id'], 'uq_variant_combo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
