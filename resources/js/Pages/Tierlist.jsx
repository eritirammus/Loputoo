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

export default function Home({ auth }) {
  const [query, setQuery] = useState("");
  const [gameName, setGameName] = useState("");
  const [tagline, setTagline] = useState("");
  const [apiData, setApiData] = useState();
  const [badgeColor, setBadgeColor] = useState("");
  const [platform, setPlatform] = useState("");
  const [region, setRegion] = useState("Select Region");
  const [MatchIds, setMatchIds] = useState([]);

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
      fetchMatchIds("ranked");
    }
    console.log(apiData);
  }, []);

  return (
    <AuthenticatedLayout>
      <Head title="Tierlist" />
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
      ></Nav>
    </AuthenticatedLayout>
  );
}
