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
            $table->unsignedBigInteger('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('variant_id')->nullable();
            $table->foreign('variant_id')->references('id')->on('product_variants')->onUpdate('cascade')->onDelete('cascade');
            $table->string('product_title', 255)->nullable();
            $table->string('sku', 100)->nullable();
            $table->string('color_name', 80)->nullable();
            $table->string('size_name', 20)->nullable();
            $table->string('image_url', 500)->nullable();
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('offer_price', 15, 2)->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('total_price', 15, 2)->default(0);
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
