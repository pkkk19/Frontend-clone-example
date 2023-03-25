<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id()->from(1000);
            $table->foreignId('user_id');
            $table->double('price', 20);
            $table->foreignId('currency_id');
            $table->integer('rate')->default(1);
            $table->string('note', 191)->nullable();
            $table->foreignId('shop_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->double('tax')->default(1);
            $table->double('commission_fee')->nullable();
            $table->string('status')->default('new');
            $table->foreignId('delivery_address_id')->nullable()->index()
                ->constrained('user_addresses');
            $table->foreignId('delivery_type_id')->nullable()->constrained('deliveries');
            $table->double('delivery_fee', 20)->default(0);
            $table->foreignId('deliveryman')->nullable()->index();
            $table->date('delivery_date')->nullable();
            $table->string('delivery_time')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
