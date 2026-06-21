<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->longText('detail')->nullable();
            $table->string('icon')->nullable();
            $table->string('is_active');
            $table->string('sort_order');
            $table->string('image')->nullable();
            $table->timestamps();
           
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};