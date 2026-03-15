<?php

use App\Enums\RefundStatus;
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
            $table->unsignedBigInteger('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('order_item_id')->nullable();
            $table->foreign('order_item_id')->references('id')->on('order_items')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('payment_transaction_id');
            $table->foreign('payment_transaction_id')->references('id')->on('payment_transactions')->onUpdate('cascade')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('reason', 30);
            $table->text('note')->nullable();
            $table->string('status', 20)->default(RefundStatus::PENDING->value);
            $table->unsignedBigInteger('refunded_by')->nullable();
            $table->foreign('refunded_by')->references('id')->on('admins')->onUpdate('cascade')->onDelete('cascade');
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
