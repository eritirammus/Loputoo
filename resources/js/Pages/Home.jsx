import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import Nav from "@/Pages/Includes/Nav";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

export default function Home({ auth }) {
  const [query, setQuery] = useState("");
  const [gameName, setGameName] = useState("");
  const [tagline, setTagline] = useState("");
  const [apiData, setApiData] = useState();
  const [badgeColor, setBadgeColor] = useState("");
  const [region, setRegion] = useState("Select Region");
  const [matchIds, setMatchIds] = useState("");
  // const [matchData, setMatchData] = useState();

  function fetchMatchIds(
    queueType = "queueType",
    puuid = apiData?.data1.puuid
  ) {
    axios
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
  }
  useEffect(() => {
    if (apiData) {
      fetchMatchIds("ranked");
    }
    console.log(apiData);
  }, []);

  return (
    <AuthenticatedLayout
      user={auth.user}
      // header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
    >
      <Head title="Dashboard" />

      <Nav
        query={query}
        setQuery={setQuery}
        gameName={gameName}
        setGameName={setGameName}
        tagline={tagline}
        setTagline={setTagline}
        apiData={apiData}
        setApiData={setApiData}
        // fetchMatchData={fetchMatchData}
        fetchMatchIds={fetchMatchIds}
      />

      <div>
        <div className="sm:p-6 lg:p-7 ">
          <div
            className={
              apiData && !apiData?.error
                ? "grid grid-cols-4 w-full gap-4"
                : "hidden"
            }
          >
            <div className="bg-[#1A1A22] h-auto w-full overflow-hidden shadow-sm sm:rounded-xl col-span-1 flex flex-col">
              <div className="p-7 text-textPurple">
                <div className="w-full flex flex-col items-center justify-center relative">
                  <Avatar>
                    <AvatarImage
                      src={
                        "https://blitz-cdn.blitz.gg/blitz/lol/profileicon/" +
                        apiData?.data2.profileIconId +
                        ".webp"
                      }
                    />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  <div
                    className={
                      "w-fit px-6 py-1 font-bold text-white border-2 rounded-full absolute -bottom-2 backdrop-blur"
                    }
                    style={{ background: badgeColor }}
                  >
                    <h2 className="w-full text-center">
                      {apiData?.data2.summonerLevel}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="w-full pb-4 flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold text-white">
                  {`${gameName}#${tagline}`}
                </h1>
                <div className="p-5">
                  <select
                    name="queueType"
                    id="queueType"
                    className="w-full bg-transparent border px-2 rounded-md"
                    onChange={(e) => {
                      const selectedQueueType = e.target.value;
                      fetchMatchId(selectedQueueType);
                    }}
                  >
                    <option value="">All gamemodes</option>
                    <option value="ranked">Ranked</option>
                    <option value="normal">Normal</option>
                    <option value="tourney">Tourney</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>

                {apiData?.data3?.map((data) => (
                  <div className="w-full p-5" key={data.id}>
                    <div className="">
                      <h1 className="text-lg">
                        {data.queueType}
                      </h1>
                      <h1 className="text-lg font-semibold">
                        {data.tier} {data.rank} {}
                        {data.leaguePoints}LP
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
            <div className="h-auto w-full bg-[#1A1A22] rounded-md overflow-hidden shadow-sm col-span-3 grid grid-cols-1 gap-4">
              <div className="p-4">
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
                {matchIds &&
                  matchIds?.map((matchId) => (
                    <div
                      className="bg-bgBlue sm:rounded-xl p-4 text-textPurple"
                      key={matchId}
                    >
                      <h1 className="text-lg">{matchId}</h1>
                    </div>
                  ))}
              </div>
              <div className="p-7 text-textPurple bg-[#1A1A22] sm:rounded-xl"></div>
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
