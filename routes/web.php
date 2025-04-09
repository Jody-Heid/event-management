<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\EventGalleryController;
use App\Http\Controllers\HomePageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomePageController::class);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('events', EventController::class);
    Route::resource('event-gallery', EventGalleryController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
