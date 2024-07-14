<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

Route::get('/', function () {
    return inertia('Home');
});

Route::inertia('/start', 'Start');
Route::inertia('/camera', 'CameraPage');

Route::post('/store-image', function (Request $request) {
    // dd($request->input('img'));
    foreach ($request->input('img') as $image) {
        $pict = explode(',', $image)[1];

        Storage::put('coba/'.Str::random(40).'.png', base64_decode($pict));
    }

    return redirect()->back();
});
