<?php

use App\Enums\MethodModeStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('payment_gateways', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sort_order')->default(0)->index();

            $table->string('name')->index();
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->longText('live_data')->nullable();
            $table->longText('sandbox_data')->nullable();
            $table->boolean('is_active')->index()->default(true);
            $table->string('mode')->index()->default(MethodModeStatus::LIVE->value);
            $table->unsignedBigInteger('updated_by')->nullable()->index();

            $table->timestamps();
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_gateways');
    }
};
