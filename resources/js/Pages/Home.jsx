import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatDistanceToNow } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";

export default function Home({ auth }) {
  const [query, setQuery] = useState("");
  const [gameName, setGameName] = useState("");
  const [tagline, setTagline] = useState("");
  const [apiData, setApiData] = useState();
  const [badgeColor, setBadgeColor] = useState("");
  const [platform, setPlatform] = useState("");
  const [region, setRegion] = useState("Select Region");
  const [MatchIds, setMatchIds] = useState([]);
  const [gameDataStartNr, setGameDataStartNr] = useState(5);

  let promise = null;

  function formatTimeAgo(timestamp) {
    const dateFromTimestamp = new Date(timestamp);
    return formatDistanceToNow(dateFromTimestamp, { addSuffix: true });
  }

  function formatLocaleDateTime(timestamp) {
    const dateFromTimestamp = new Date(timestamp);
    return new Intl.DateTimeFormat(navigator.language, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(dateFromTimestamp);
  }

  function fetchMatchIds(queueType = "", puuid = apiData?.data1.puuid) {
    if (queueType == "-") {
      queueType = "";
    }

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

  function fetchMoreMatchIds(queueType = "", puuid = apiData?.data1.puuid) {
    if (queueType == "-") {
      queueType = "";
    }

    promise = axios
      .get(`/api/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
        params: {
          queueType: queueType,
          platform: platform,
          start: gameDataStartNr,
        },
      })
      .then((response) => {
        setMatchIds((prevMatchIds) => [...prevMatchIds, ...response.data]);
        console.log(response.data);
        setGameDataStartNr(gameDataStartNr + 5);
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
                ? "grid grid-cols-1 sm:grid-cols-4 w-full gap-4 h-fit"
                : "hidden"
            }
          >
            <div className=" h-full relative">
              <div className="bg-[#1A1A22] h-fit w-full overflow-hidden shadow-sm rounded-xl col-span-1 flex flex-col sticky top-4">
                <div className="p-7 text-textPurple">
                  <div className="w-full flex flex-col items-center justify-center relative">
                    <Avatar>
                      {apiData && apiData.data2 ? (
                        <AvatarImage
                          src={
                            "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/profileicon/" +
                            apiData.data2.profileIconId +
                            ".png"
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
                    </div>
                    §
                  </div>
                </div>
                <div className="w-full pb-4 flex flex-col items-center justify-center gap-2">
                  <h1 className="text-xl font-bold text-white">
                    {`${gameName}#${tagline}`}
                  </h1>
                  {apiData?.data3?.map((data) => (
                    <div
                      className="w-full p-5 flex flex-col gap-2 "
                      key={data.id}
                    >
                      <div className="flex items-center gap-2 bg">
                        <img
                          className={data.tier ? "h-32" : "hidden"}
                          src={`/RankedEmblemsLatest/Rank=${data.tier}.png`}
                          alt="Rank Emblem"
                        />
                        <div className="w-full h-fit">
                          <div className="">
                            <h1 className="text-lg font-bold">
                              {data.queueType.includes("_") ? (
                                <h1 className="text-lg font-bold">
                                  {data.queueType.split("_")[0] +
                                    " " +
                                    data.queueType.split("_")[1]}
                                </h1>
                              ) : (
                                <h1 className="text-lg font-bold">
                                  {data.queueType == "CHERRY"
                                    ? "ARENA"
                                    : data.queueType}
                                </h1>
                              )}
                            </h1>
                            <h1 className="text-lg font-semibold1">
                              <div></div>
                              {data.tier}
                              {data.rank}
                              {data.leaguePoints} LP
                            </h1>
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <h2>
                          {data.wins}W {data.losses}L
                        </h2>
                        <Progress
                          className="w-full"
                          value={data.leaguePoints}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full col-span-3">
              <Select
                name="platform"
                id="platform"
                onValueChange={fetchMatchIds}
              >
                <SelectTrigger className="w-full bg-[#1A1A22] border-none">
                  <SelectValue placeholder="All gamemodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">All Gamemodes</SelectItem>
                  <SelectItem value="ranked">Ranked</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="tourney">Tourney</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                </SelectContent>
              </Select>
              <div className="h-fit w-full bg-[#1A1A22] rounded-md overflow-hidden shadow-sm col-span-3 grid grid-cols-1">
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
                    MatchIds?.map((data) => {
                      const gameMode =
                        data.info.gameMode === "CHERRY"
                          ? "Arena"
                          : data.info.gameMode;
                      console.log(data.info);
                      // Convert gameDuration to hours, minutes and seconds
                      const hours = Math.floor(data.info.gameDuration / 3600);
                      const minutes = Math.floor(
                        (data.info.gameDuration % 3600) / 60
                      );
                      const seconds = data.info.gameDuration % 60;

                      const selectedPlayerInfo = data.info.participants.find(
                        (participant) => {
                          return (
                            participant.puuid ===
                            localStorage.getItem("searchedUserPUUID")
                          );
                        }
                      );

                      return (
                        <div
                          className="bg-bgBlue sm:rounded-xl p-4 text-textPurple "
                          key={data}
                        >
                          <Collapsible>
                            <CollapsibleTrigger className="w-full">
                              <div className="w-full grid grid-cols-7">
                                <div className="text-left">
                                  <h1 className="text-lg font-bold col-span-1 col-start-1 text-start">
                                    {gameMode}
                                  </h1>

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
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <p>
                                          {formatTimeAgo(
                                            data.info.gameStartTimestamp
                                          )}
                                        </p>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {formatLocaleDateTime(
                                            data.info.gameStartTimestamp
                                          )}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <div>
                                  <img
                                    className="h-18 w-18"
                                    src={
                                      selectedPlayerInfo?.item0 != 0
                                        ? `https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${selectedPlayerInfo?.item0}.png`
                                        : `/EmptyBox.png`
                                    }
                                    alt="item0"
                                  />
                                </div>
                                <div className="w-full h-26 gap-2 col-start-3 col-span-2">
                                  <div className="flex flex-wrap gap-1 h-full">
                                    <img
                                      className="h-10 w-10"
                                      src={
                                        selectedPlayerInfo?.item0 != 0
                                          ? `https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${selectedPlayerInfo?.item0}.png`
                                          : `/EmptyBox.png`
                                      }
                                      alt="item0"
                                    />
                                    <img
                                      className="h-10 w-10"
                                      src={
                                        selectedPlayerInfo?.item1 != 0
                                          ? `https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${selectedPlayerInfo?.item1}.png`
                                          : `/EmptyBox.png`
                                      }
                                      alt="item1"
                                    />
                                    <img
                                      className="h-10 w-10"
                                      src={
                                        selectedPlayerInfo?.item2 != 0
                                          ? `https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${selectedPlayerInfo?.item2}.png`
                                          : `/EmptyBox.png`
                                      }
                                      alt="item2"
                                    />

                                    <img
                                      className="h-10 w-10"
                                      src={
                                        selectedPlayerInfo?.item3 != 0
                                          ? `https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${selectedPlayerInfo?.item3}.png`
                                          : `/EmptyBox.png`
                                      }
                                      alt="item3"
                                    />
                                    <img
                                      className="h-10 w-10"
                                      src={
                                        selectedPlayerInfo?.item4 != 0
                                          ? `https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${selectedPlayerInfo?.item4}.png`
                                          : `/EmptyBox.png`
                                      }
                                      alt="item4"
                                    />
                                    <img
                                      className="h-10 w-10"
                                      src={
                                        selectedPlayerInfo?.item5 != 0
                                          ? `https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${selectedPlayerInfo?.item5}.png`
                                          : `/EmptyBox.png`
                                      }
                                      alt="item5"
                                    />
                                    <img
                                      className="h-10 w-10"
                                      src={
                                        selectedPlayerInfo?.item6 != 0
                                          ? `https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${selectedPlayerInfo?.item6}.png`
                                          : `/EmptyBox.png`
                                      }
                                      alt="item6"
                                    />
                                  </div>
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="flex gap-2 mt-4">
                                {data.info.teams.map((team) => (
                                  <div className="flex flex-col w-1/2 gap-2">
                                    <p>{team.teamId}</p>
                                    {data.info.participants.map(
                                      (participant) => {
                                        if (team.teamId == 0) {
                                          team.teamId = 200;
                                        }

                                        if (
                                          participant.teamId === team.teamId
                                        ) {
                                          const searchedUserPUUID =
                                            localStorage.getItem(
                                              "searchedUserPUUID"
                                            );
                                          if (
                                            participant.championName ==
                                            "FiddleSticks"
                                          ) {
                                            participant.championName =
                                              "Fiddlesticks";
                                          }
                                          return (
                                            <div className="flex gap-2">
                                              <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                  src={
                                                    "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/champion/" +
                                                    participant.championName +
                                                    ".png"
                                                  }
                                                />
                                              </Avatar>
                                              <div className="flex flex-col gap-1">
                                                <h1
                                                  className={
                                                    participant.puuid ==
                                                    searchedUserPUUID
                                                      ? "font-bold text-white"
                                                      : ""
                                                  }
                                                >
                                                  {`${participant.riotIdGameName}#${participant.riotIdTagline}` ||
                                                    participant.championName}
                                                </h1>
                                                <h1>
                                                  {participant.championLevel}
                                                </h1>
                                              </div>
                                            </div>
                                          );
                                        }
                                      }
                                    )}
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      );
                    })}
                </div>
              </div>
              <Button
                onClick={() => {
                  fetchMoreMatchIds();
                }}
                className={
                  MatchIds && MatchIds.length == 0
                    ? "hidden"
                    : "p-4 bg-[#1A1A22]"
                }
              >
                <p className="w-full text-center">Load more</p>
              </Button>
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
