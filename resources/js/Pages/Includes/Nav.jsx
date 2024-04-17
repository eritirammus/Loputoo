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
          setApiData(response.data);
          fetchMatchData("", response.data1.puuid);
          console.log(apiData);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } else {
      console.log("Your platform/region/gamename hasn't been selected");
    }
  }

  return (
    <nav>
      <div className="grid grid-cols-12 gap-x-4 px-7 pt-5 items-center">
        <div className="flex justify-start col-span-1">
          <Link href="/">
            <ApplicationLogo />
          </Link>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="h-3/4 col-span-8 w-full grid grid-cols-8 gap-4"
        >
          <div className="flex justify-center col-span-2 w-full">
            <select
              name="platform"
              id="platform"
              className="w-full bg-transparent border px-2 rounded-2xl"
              onChange={(e) => {
                setPlatform(e.target.value);
              }}
            >
              <option value="" selected>
                Select platform
              </option>
              <option value="americas">Americas</option>
              <option value="asia">Asia</option>
              <option value="europe">Europe</option>
              <option value="sea">SEA</option>
            </select>

            <select
              name="region"
              id="region"
              className="w-full bg-transparent border px-2 rounded-2xl"
              onChange={(e) => {
                setRegion(e.target.value);
              }}
            >
              {platform === "" && (
                <>
                  <option value="" selected>
                    Select region
                  </option>
                </>
              )}
              {platform === "americas" && (
                <>
                  <option value="br1">Brazil</option>
                  <option value="na1">NA</option>
                  <option value="oc1">OCE</option>
                  <option value="la1">LAN</option>
                  <option value="la2">LAS</option>
                </>
              )}
              {platform === "asia" && (
                <>
                  <option value="jp1">Japan</option>
                  <option value="kr">Korea</option>
                </>
              )}
              {platform === "europe" && (
                <>
                  <option value="euw1">Europe West</option>
                  <option value="eun1">Europe Nordic & East</option>
                  <option value="ru">Russia</option>
                  <option value="tr1">Turkey</option>
                </>
              )}
              {platform === "sea" && (
                <>
                  <option value="sea">SEA</option>
                </>
              )}
            </select>
          </div>
          <div className="col-span-6 flex gap-x-2 w-full h-full">
            <Input
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              className="h-full w-full"
            />
            <button type="submit" value="search" className="h-full">
              <Search size={36}/>
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
}
