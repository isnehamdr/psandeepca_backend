<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ServiceController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {


    Route::get('/', function () {
        return Inertia::render('AdminDashboard');
    })->name('admin.dashboard');

Route::get('/blogs',function(){
    return Inertia::render('AdminPage/AdminBlog');
});
Route::get('/services',function(){
    return Inertia::render('AdminPage/AdminService');
});
Route::get('/users',function(){
    return Inertia::render('AdminPage/UserManagement');
});

Route::get('/ourusers', [UserController::class, 'index'])->name('ourusers.index');
Route::post('/ourusers', [UserController::class, 'store'])->name('ourusers.store');
Route::put('/ourusers/{id}', [UserController::class, 'update'])->name('ourusers.update');
Route::delete('/ourusers/{id}', [UserController::class, 'destroy'])->name('ourusers.destroy');


Route::get('/ourblogs', [BlogController::class, 'index'])->name('ourblogs.index');
Route::post('/ourblogs', [BlogController::class, 'store'])->name('ourblogs.store');
Route::put('/ourblogs/{blog}', [BlogController::class, 'update'])->name('ourblogs.update');
Route::delete('/ourblogs/{blog}', [BlogController::class, 'destroy'])->name('ourblogs.destroy');

Route::get('/ourservices', [ServiceController::class, 'index'])->name('ourservices.index');
Route::post('/ourservices', [ServiceController::class, 'store'])->name('ourservices.store');
Route::put('/ourservices/{id}', [ServiceController::class, 'update'])->name('ourservices.update');
Route::delete('/ourservices/{id}', [ServiceController::class, 'destroy'])->name('ourservices.destroy');




    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
