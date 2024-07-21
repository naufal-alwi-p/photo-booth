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
        'image_width',
        'image_height',
        'left_margin',
        'right_margin',
        'top_margin',
        'bottom_margin',
        'margin_between',
        'orientation'
    ];

    public $timestamps = false;
}
