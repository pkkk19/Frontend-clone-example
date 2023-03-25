<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropColumnFromTermConditions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('term_conditions', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->dropColumn('title');
            $table->dropColumn('description');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('term_conditions', function (Blueprint $table) {
            $table->string('type')->default('terms');
            $table->string('title');
            $table->text('description');
        });
    }
}
