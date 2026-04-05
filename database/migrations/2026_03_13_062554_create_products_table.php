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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id')->index();
            $table->foreign('category_id')->references('id')->on('categories')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('subcategory_id')->nullable()->index();
            $table->foreign('subcategory_id')->references('id')->on('categories')->onUpdate('cascade')->onDelete('cascade');

            $table->string('title', 255)->index();
            $table->string('slug', 300)->unique()->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 15, 2)->default(0)->index();
            $table->string('discount')->nullable();
            $table->string('discount_type')->nullable()->index();
            $table->dateTime('discount_starts_at')->nullable();
            $table->dateTime('discount_ends_at')->nullable();
            $table->string('type', 20)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_new')->default(false)->index();
            $table->string('status', 20)->default('draft')->index();
            $table->integer('sort_order')->default(0)->index();

            $table->string('meta_title', 160)->nullable();
            $table->string('meta_description', 320)->nullable();
            $table->json('meta_keywords')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('created_by')->references('id')->on('admins')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('updated_by')->references('id')->on('admins')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('deleted_by')->references('id')->on('admins')->onUpdate('cascade')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
