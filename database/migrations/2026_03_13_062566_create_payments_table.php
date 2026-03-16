<?php

use App\Enums\PaymentStatus;
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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onUpdate('cascade')->onDelete('cascade');
            $table->string('method', 60);
            $table->string('gateway_txn_id', 255)->nullable()->index();
            $table->decimal('amount', 10, 2)->index();
            $table->char('currency', 3)->default('USD')->index();
            $table->string('status', 20)->default(PaymentStatus::PENDING->value)->index();
            $table->timestamp('paid_at')->nullable()->index();
            $table->string('gateway_response', 2000)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
