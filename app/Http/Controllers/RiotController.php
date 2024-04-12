<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class RiotController extends Controller
{
    public function getData($region, $gameName , $tagLine)
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
        // Fetch new data from the API

        $response = Http::withHeaders([
            'X-Riot-Token' => env('VITE_LOL_API_KEY')
        ])->get('https://' . 'europe' . '.api.riotgames.com/riot/account/v1/accounts/by-riot-id/' . $gameName . '/' . $tagLine);

        if ($response->successful()) {

            $response2 = Http::withHeaders([
                'X-Riot-Token' => env('VITE_LOL_API_KEY')
            ])->get('https://' . $region . '.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/' . $response['puuid']);
                Log::info($response2);

            if ($response2->successful()) {
                // return response()->json($response2->json());

                $response3 = Http::withHeaders([
                    'X-Riot-Token' => env('VITE_LOL_API_KEY')
                ])->get('https://' . $region . '.api.riotgames.com/lol/league/v4/entries/by-summoner/' . $response2['id']);
                    Log::info($response3);
            } else {
                return response()->json(['error' => "Failed to fetch Riot api"]);
            }

            return response()->json(['data1' => $response->json(), 'data2' => $response2->json(), 'data3' => $response3->json()]);
        } else {
            return response()->json(['error' => "Failed to fetch Riot api"]);
        }
        
        // return $data;
        // return response()->json($summonerName);
    }

}




