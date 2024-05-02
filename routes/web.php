<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/Tierlist', function () {
    return Inertia::render('Tierlist');
})->name('tierlist');

require __DIR__.'/auth.php';
