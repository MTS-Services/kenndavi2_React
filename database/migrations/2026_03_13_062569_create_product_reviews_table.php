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
        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->foreignId('order_item_id')->nullable()->constrained('order_items');
            $table->unsignedTinyInteger('rating');
            $table->string('title', 160)->nullable();
            $table->text('comment')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->integer('helpful_count')->default(0);
            $table->string('status', 20)->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_reviews');
    }
};
