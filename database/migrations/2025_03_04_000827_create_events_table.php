<?php

use App\Enums\EventStatusEnum;
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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description');
            $table->timestamp('start_date');
            $table->timestamp('end_date');
            $table->timestamp('image');
            $table->string('address');
            $table->integer('num_tickets');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('country_id')->constrained();
            $table->foreignId('city_id')->constrained();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
