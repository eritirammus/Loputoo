import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Nav from "@/Pages/Includes/Nav";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { Toaster, toast } from "sonner";

export default function Home({ auth }) {
  const [query, setQuery] = useState("");
  const [gameName, setGameName] = useState("");
  const [tagline, setTagline] = useState("");
  const [apiData, setApiData] = useState();
  const [badgeColor, setBadgeColor] = useState("");
  const [platform, setPlatform] = useState("");
  const [region, setRegion] = useState("Select Region");
  const [MatchIds, setMatchIds] = useState([]);

  let promise = null;

  function fetchMatchIds(queueType = "", puuid = apiData?.data1.puuid) {
    promise = axios
      .get(`/api/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
        params: {
          queueType: queueType,
          platform: platform,
        },
      })
      .then((response) => {
        setMatchIds(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    toast.promise(promise, {
      loading: "Loading match datas",
      success: (data) => {
        return `Data loaded successfully`;
      },
      error: "Error loading match data",
    });
  }
  const [matchData, setMatchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  function fetchMatchData(matchId) {
    axios
      .get(`/api/lol/match/v5/matches/${matchId}`, {
        params: {
          platform: platform,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  useEffect(() => {
    if (apiData) {
      fetchMatchIds("");
    }
    console.log(apiData);
  }, []);

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      <Nav
        query={query}
        setQuery={setQuery}
        platform={platform}
        setPlatform={setPlatform}
        region={region}
        setRegion={setRegion}
        gameName={gameName}
        setGameName={setGameName}
        tagline={tagline}
        setTagline={setTagline}
        apiData={apiData}
        setApiData={setApiData}
        fetchMatchData={fetchMatchData}
        fetchMatchIds={fetchMatchIds}
      />

      <div>
        <div className="p-4 sm:p-6 lg:p-7 ">
          <div
            className={
              apiData && !apiData?.error
                ? "grid grid-cols-1 sm:grid-cols-4 w-full gap-4"
                : "hidden"
            }
          >
            <div className="bg-[#1A1A22] h-fit w-full overflow-hidden shadow-sm rounded-xl col-span-1 flex flex-col">
              <div className="p-7 text-textPurple">
                <div className="w-full flex flex-col items-center justify-center relative">
                  <Avatar>
                    {apiData && apiData.data2 ? (
                      <AvatarImage
                        src={
                          "/profileicon/" + apiData.data2.profileIconId + ".png"
                        }
                      />
                    ) : (
                      <AvatarFallback>?</AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={
                      "w-fit px-6 py-1 font-bold text-white border-2 rounded-full absolute -bottom-2 backdrop-blur"
                    }
                    style={{ background: badgeColor }}
                  >
                    <h2 className="w-full text-center">
                      {apiData && apiData.data2
                        ? apiData.data2.summonerLevel
                        : "N/A"}
                    </h2>
                  </div>§
                </div>
              </div>
              <div className="w-full pb-4 flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold text-white">
                  {`${gameName}#${tagline}`}
                </h1>

                {apiData?.data3?.map((data) => (
                  <div className="w-full p-5" key={data.id}>
                    <div className="">
                      <h1 className="text-lg font-bold">
                        {data.queueType.split("_")[0] +
                          " " +
                          data.queueType.split("_")[1]}
                      </h1>
                      <h1 className="text-lg font-semibold">
                        {data.tier} {data.rank}
                        {data.leaguePoints} LP
                      </h1>
                    </div>
                    <div className="">
                      <h2>
                        {data.wins}W {data.losses}L
                      </h2>
                      <Progress className="w-full" value={data.leaguePoints} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-fit w-full bg-[#1A1A22] rounded-md overflow-hidden shadow-sm col-span-3 grid grid-cols-1">
              <div className="px-5 pt-5">
                <select
                  name="queueType"
                  id="queueType"
                  className="w-full bg-transparent border px-2 rounded-md"
                  onChange={(e) => {
                    const selectedQueueType = e.target.value;
                    fetchMatchIds(selectedQueueType);
                  }}
                >
                  <option selected value="">
                    All gamemodes
                  </option>
                  <option value="ranked">Ranked</option>
                  <option value="normal">Normal</option>
                  <option value="tourney">Tourney</option>
                  <option value="tutorial">Tutorial</option>
                </select>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between">
                  <h2 className="font-bold text-textPurple text-xl">
                    Recent Matches
                  </h2>
                  <Button
                    className="font-semibold text-textPurple text-lg"
                    variant="primary"
                  >
                    View All
                  </Button>
                </div>
                {MatchIds &&
                  MatchIds.data2?.map((data) => {
                    const gameMode =
                      data.info.gameMode === "CLASSIC"
                        ? "Draft"
                        : data.info.gameMode === "CHERRY"
                        ? "Arena"
                        : data.info.gameMode;
                      console.log(data.info);

                    // Convert gameDuration to hours, minutes and seconds
                    const hours = Math.floor(data.info.gameDuration / 3600);
                    const minutes = Math.floor(
                      (data.info.gameDuration % 3600) / 60
                    );
                    const seconds = data.info.gameDuration % 60;

                    return (
                      <div
                        className="bg-bgBlue sm:rounded-xl p-4 text-textPurple"
                        key={data}
                      >
                        <h1 className="text-lg">{gameMode}</h1>
                        {hours > 0 && (
                          <h1 className="text-lg">
                            {hours}h {minutes}m {seconds}s
                          </h1>
                        )}
                        {hours === 0 && (
                          <h1 className="text-lg">
                            {minutes}m {seconds}s
                          </h1>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className={apiData && apiData.error ? "" : "hidden"}>
            <Alert variant="destructive" className="w-fit min-w-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{apiData?.error}</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
