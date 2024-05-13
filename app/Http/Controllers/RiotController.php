<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class RiotController extends Controller
{
    public function getData($platform, $region, $gameName, $tagLine)
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

        $accountData = Http::withHeaders([
            'X-Riot-Token' => env('VITE_LOL_API_KEY')
        ])->get('https://' . $platform . '.api.riotgames.com/riot/account/v1/accounts/by-riot-id/' . $gameName . '/' . $tagLine);
        Log::info($accountData);
        if ($accountData->successful()) {

            $summonerData = Http::withHeaders([
                'X-Riot-Token' => env('VITE_LOL_API_KEY')
            ])->get('https://' . $region . '.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/' . $accountData['puuid']);
            Log::info($summonerData);

            $leagueEntriesData = Http::withHeaders([
                'X-Riot-Token' => env('VITE_LOL_API_KEY')
            ])->get('https://' . $region . '.api.riotgames.com/lol/league/v4/entries/by-summoner/' . $summonerData['id']);
            Log::info($leagueEntriesData);

            return response()->json(['data1' => $accountData->json(), 'data2' => $summonerData->json(), 'data3' => $leagueEntriesData->json()]);
        } else {
            return response()->json(['error' => "Failed to fetch Riot api"]);
        }
    }

    public function getMatchIds($puuid)
    {
        $platform = request()->get('platform');
        $queueType = request()->get('queueType');
        $response = Http::withHeaders([
            'X-Riot-Token' => env('VITE_LOL_API_KEY')
        ])->get('https://' . $platform . '.api.riotgames.com/lol/match/v5/matches/by-puuid/' . $puuid . '/ids?' . "count=5&type=" . $queueType);
        Log::info($response);

        if ($response->successful()) {
            $matchDatas = [];

            foreach ($response->json() as $matchId) {
                $response2 = Http::withHeaders([
                    'X-Riot-Token' => env('VITE_LOL_API_KEY')
                ])->get('https://' . $platform . '.api.riotgames.com/lol/match/v5/matches/' . $matchId);
                Log::info($response2);
                if ($response2->successful()) {
                    $matchDatas[] = $response2->json();
                } else {
                    return response()->json(['error' => "Failed to fetch Riot api on match datas"]);
                }
            }
            return response()->json(['data1' => $response->json(), 'data2' => $matchDatas]);
        } else {
            return response()->json(['error' => "Failed to fetch Riot api"]);
        }
    }
}
