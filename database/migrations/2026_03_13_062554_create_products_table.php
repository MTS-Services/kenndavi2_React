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
            $table->foreignId('category_id')->constrained('categories');
            $table->string('title', 255);
            $table->string('slug', 300)->unique();
            $table->text('description')->nullable();
            $table->string('type', 20);
            $table->boolean('is_featured')->default(false);
            $table->string('status', 20)->default('draft');
            $table->integer('sort_order')->default(0);

            $table->string('meta_title', 160)->nullable();
            $table->string('meta_description', 320)->nullable();
            $table->json('meta_keywords')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('admins');
            $table->foreignId('updated_by')->nullable()->constrained('admins');
            $table->foreignId('deleted_by')->nullable()->constrained('admins');

            $table->timestamps();
            $table->softDeletes();
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
