<?php

use App\Http\Controllers\RiotController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

Route::get('/lol/data/{region}/{summonerName}', [RiotController::class, 'getData']);


Route::get('/', function () {

    // Check if the file exists and its modified time is less than 15 minutes ago with one if statement
    if (file_exists('cache.json') && filemtime('cache.json') > time() - 60 * 15) {
        Log::info('cache.json exists and is less than 15 minutes old');
        return response()->json(json_decode(file_get_contents('cache.json')));
    } else {
        // make an API request and store its data to cache.json
        $response = Http::get('https://mannicoon.com/api/cats');
        $data = $response->json();
        $cache = [
            'last_updated' => time(),
            'data' => $data
        ]; 
        Log::info('cache.json does not exist or is more than 15 minutes old');
        // update cache.json
        file_put_contents('cache.json', json_encode($cache));
        return response()->json($cache);
    }
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('test' , function() {
    return 'test';
});
