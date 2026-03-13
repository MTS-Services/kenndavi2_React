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
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->text('content')->nullable();
            $table->string('action_url', 255)->nullable();
            $table->string('action_title', 100)->nullable();

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
        Schema::dropIfExists('banners');
    }
};
