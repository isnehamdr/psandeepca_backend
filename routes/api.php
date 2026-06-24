<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\HeroController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ServiceController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::get('/blog', [BlogController::class, 'index']);
Route::get('/blog/{slug}', [BlogController::class, 'indexShowblogSlug']);

Route::get('/hero', [HeroController::class, 'index']);
Route::get('/team', [TeamController::class, 'index']);
Route::get('/service', [ServiceController::class, 'index']);
Route::get('/service/{slug}', [ServiceController::class, 'indexShowserviceSlug']);

