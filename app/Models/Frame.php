<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Frame extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'filename',
        'frame_width',
        'frame_height',
        'number_of_photos',
        'row',
        'column',
        'image_width',
        'image_height',
        'left_margin',
        'right_margin',
        'top_margin',
        'bottom_margin',
        'margin_x_between',
        'margin_y_between',
        'photo_position',
        'printable',
        'visibility'
    ];

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'photo_position' => 'array',
        ];
    }
}
