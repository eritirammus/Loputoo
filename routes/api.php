<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Carbon\Carbon;

Route::get('/lol/summoner/v4/summoners/by-name/{summonerName}', function () {
    $data = null;
    $filename = 'api_data.json';
    $expirationTime = now()->addMinutes(60); // Set expiration time (e.g., 60 minutes from now)

    // Check if the file exists and is not expired
    if (Storage::exists($filename)) { 
        $data = Storage::get($filename);
        $data = json_decode($data, true);

        // Check expiration time
        if (Carbon::parse($data['expiration_time'])->isFuture()) {
            return $data['data'];
        }
    }

    // Fetch new data from the API
    $response = Http::get('https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summonerName}');

    if ($response->successful()) {
        $data = $response->json();

        // Save data to local file
        Storage::put($filename, json_encode(['data' => $data, 'expiration_time' => $expirationTime]));
    } else {
        return "Failed to fetch data from the API";
    }

    return $data;
});

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
