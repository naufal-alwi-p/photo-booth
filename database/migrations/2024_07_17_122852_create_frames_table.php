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
        Schema::create('frames', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('filename');
            $table->float('frame_width');
            $table->float('frame_height');
            $table->integer('number_of_photos');
            $table->integer('row');
            $table->integer('column');
            $table->float('image_width');
            $table->float('image_height');
            $table->float('left_margin');
            $table->float('right_margin');
            $table->float('top_margin');
            $table->float('bottom_margin');
            $table->float('margin_x_between');
            $table->float('margin_y_between');
            $table->json('photo_position');
            $table->boolean('printable');
            $table->boolean('visibility');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('frames');
    }
};
