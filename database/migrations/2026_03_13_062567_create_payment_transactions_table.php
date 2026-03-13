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
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments');
            $table->foreignId('order_id')->constrained('orders');
            $table->string('type', 30);
            $table->string('gateway_txn_id', 255)->nullable();
            $table->decimal('amount', 10, 2);
            $table->char('currency', 3)->default('BDT');
            $table->string('status', 20)->default('pending');
            $table->string('gateway_response', 2000)->nullable();
            $table->timestamp('initiated_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
