<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('tenants' ,TenantController::class);
    Route::resource('tenants.users' ,UserController::class);
    Route::resource('events' ,EventController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
