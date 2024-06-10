import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Input } from "@/Components/ui/input";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import axios from "axios";
import { Search } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

export default function Nav({
  query,
  setQuery,
  platform,
  setPlatform,
  region,
  setRegion,
  gameName,
  setGameName,
  tagline,
  setTagline,
  apiData,
  setApiData,
  fetchMatchData,
  fetchMatchIds,
}) {
  function handleSearch() {
    if (query && region) {
      let value = query.split("#");
      setGameName(value[0]);
      console.log(value[0]);
      setTagline(value[1]);
      console.log(value[1]);

      axios
        .get(`/api/lol/data/${platform}/${region}/${value[0]}/${value[1]}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Riot-Token": import.meta.env.VITE_LOL_API_KEY,
          },
        })
        .then((response) => {
          localStorage.setItem("searchedUserPUUID", response.data.data1?.puuid);
          setApiData(response.data);
        })
        .catch((error) => {
          console.log("Error:", error);
        })
        .finally(() => {
          fetchMatchIds("", localStorage.getItem("searchedUserPUUID"));
        });
    } else {
      console.log("Your platform/region/gamename hasn't been selected");
    }
  }

  return (
    <nav>
      <div>
        <div className="grid grid-cols-12 sm:grid-cols-12 gap-4 p-4 sm:px-7 items-center font-bold">
          <div className="justify-start col-span-1">
            <Link href="/">
              <ApplicationLogo />
            </Link>
          </div>

          <Select
            name="platform"
            id="platform"
            onValueChange={setPlatform}
            defaultValue={platform}
          >
            <SelectTrigger className="col-span-2">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="americas">Americas</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="sea">SEA</SelectItem>
            </SelectContent>
          </Select>
          <Select name="region" id="region" onValueChange={setRegion}>
            <SelectTrigger className="col-span-2">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              {platform === "" && (
                <>
                  <SelectItem value="americas" selected>
                    Region
                  </SelectItem>
                </>
              )}
              {platform === "americas" && (
                <>
                  <SelectItem value="br1">Brazil</SelectItem>
                  <SelectItem value="na1">NA</SelectItem>
                  <SelectItem value="oc1">OCE</SelectItem>
                  <SelectItem value="la1">LAN</SelectItem>
                  <SelectItem value="la2">LAS</SelectItem>
                </>
              )}
              {platform === "asia" && (
                <>
                  <SelectItem value="jp1">Japan</SelectItem>
                  <SelectItem value="kr">Korea</SelectItem>
                </>
              )}
              {platform === "europe" && (
                <>
                  <SelectItem value="euw1">Europe West</SelectItem>
                  <SelectItem value="eun1">Europe Nordic & East</SelectItem>
                  <SelectItem value="ru">Russia</SelectItem>
                  <SelectItem value="tr1">Turkey</SelectItem>
                </>
              )}
              {platform === "sea" && (
                <>
                  <SelectItem value="sea">SEA</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <div className="py-2 col-span-7 col-start-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className=" grid-rows-2 rounded-2xl gap-y-4 "
            >
              <div className="gap-x-2 flex items-center">
                <Input
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  className="w-full border-none bg-compBlue rounded-lg p-2"
                  onTouchStart={(e) => {
                    e.preventDefault();
                  }}
                />
                <button
                  type="submit"
                  value="search"
                  className="h-full flex justify-center items-center"
                >
                  <Search size={24} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { Nav };
