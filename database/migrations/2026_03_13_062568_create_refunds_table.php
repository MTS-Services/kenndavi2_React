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
        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->foreignId('order_item_id')->nullable()->constrained('order_items');
            $table->foreignId('payment_transaction_id')->constrained('payment_transactions');
            $table->decimal('amount', 10, 2);
            $table->string('reason', 30);
            $table->text('note')->nullable();
            $table->string('status', 20)->default('pending');
            $table->foreignId('refunded_by')->nullable()->constrained('admins');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refunds');
    }
};
