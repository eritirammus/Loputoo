import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import Nav from "@/Pages/Includes/Nav";
import { useState } from "react";

export default function Home({ auth }) {
  const [query, setQuery] = useState("");
  const [gameName, setGameName] = useState("");
  const [tagline, setTagline] = useState("");
  const [apiData, setApiData] = useState();

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
      />

      <div className="">
        <div className="sm:p-6 lg:p-7 grid grid-cols-4 w-full gap-4">
          <div className="bg-[#1A1A22] h-auto w-full overflow-hidden shadow-sm sm:rounded-xl col-span-1 flex flex-col">
            <div className="p-7 text-textPurple">
              <Avatar>
                <AvatarImage src={'https://blitz-cdn.blitz.gg/blitz/lol/profileicon/' + apiData?.profileIconId + '.webp'} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <Badge className="h-8 w-24" variant="default">
                <h2 className="text-red-500">
                  {apiData?.summonerLevel}
                </h2>
              </Badge>
            </div>
          </div>
          <div className="h-auto w-full overflow-hidden shadow-sm  col-span-3 grid grid-cols-1 gap-4">
            <div className="p-7 text-textPurple bg-[#1A1A22] sm:rounded-xl"></div>
            <div className="p-7 text-textPurple bg-[#1A1A22] sm:rounded-xl"></div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
