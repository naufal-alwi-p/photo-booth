<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Home');

Route::inertia('/start', 'Start');
Route::inertia('/camera', 'CameraPage');
Route::post('/store-image', [UserController::class, 'storeImage']);
Route::post('/editor', [UserController::class, 'editor']);
Route::post('/select-option', [UserController::class, 'editorHandling']);
Route::post('/status-payment', [UserController::class, 'statusPayment']);
Route::post('/get-output', [UserController::class, 'getOutput']);
Route::get('/thank-you', [UserController::class, 'thankYou']);

Route::post('/get-qris', [UserController::class, 'getQris']);
Route::post('/check-status-qris', [UserController::class, 'checkStatusQris']);
Route::post('/cancel-payment', [UserController::class, 'cancelPayment']);

Route::get('/admin', [AdminController::class, 'adminLoginPage']);
Route::get('/admin/registration', [AdminController::class, 'adminRegisterPage']);
Route::get('/admin/dashboard', [AdminController::class, 'AdminDashboardPage']);
Route::get('/admin/add-frame', [AdminController::class, 'AdminAddFramePage']);

Route::post('/admin-login-handler', [AdminController::class, 'adminLoginHandler']);
Route::post('/admin-regis-handler', [AdminController::class,'adminRegisterHandling']);
Route::post('add-frame-handler', [AdminController::class, 'AdminAddFrameHandler']);
