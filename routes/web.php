<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return inertia('Home');
});

Route::inertia('/take-picture', 'TakePicture');
