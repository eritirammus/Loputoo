<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class RiotController extends Controller
{
    public function getData($summonerName)
    {


        $data = null;
        $filename = 'api_data.json';
        $expirationTime = now()->addMinutes(60); // Set expiration time (e.g., 60 minutes from now)

        // // Check if the file exists and is not expired
        // if (Storage::exists($filename)) { 
        //     $data = Storage::get($filename);
        //     $data = json_decode($data, true);

        //     // Check expiration time
        //     if (Carbon::parse($data['expiration_time'])->isFuture()) {
        //         return $data['data'];
        //     }
        // }
        Log::info('https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' . $summonerName);

        // Fetch new data from the API
        $response = Http::withHeaders([
            'X-Riot-Token' => env('VITE_LOL_API_KEY')
        ])->get('https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' . $summonerName);



        if ($response->successful()) {
            $data = $response->json();

            // Save data to local file
            // Storage::put($filename, json_encode(['data' => $data, 'expiration_time' => $expirationTime]));
            return response()->json($data,);
        } else {
            return "Failed to fetch data from the API";
            return response()->json(['error' => "Failed to fetch Riot api"]);
        }

        // return $data;



        // return response()->json($summonerName);
    }
}
