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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants');
            $table->string('product_title', 255);
            $table->string('sku', 100);
            $table->string('color_name', 80);
            $table->string('size_name', 20);
            $table->string('image_url', 500)->nullable();
            $table->decimal('unit_price', 10, 2);
            $table->decimal('offer_price', 10, 2)->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('total_price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
