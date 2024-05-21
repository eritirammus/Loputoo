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
          setApiData(response.data);
          fetchMatchData("", response.data1?.puuid);
          fetchMatchIds("");
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
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-4 p-4 sm:px-7 items-center font-bold">
          <div className="justify-start col-span-1">
            <Link href="/">
              <ApplicationLogo />
            </Link>
          </div>
          <Link href="/Tierlist">
            <button className="col-span-1">Tierlist</button>
          </Link>
        </div>
      </div>
      <div className="p-4 sm:px-7">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="grid grid-cols-8 grid-rows-2 rounded-2xl gap-y-4"
        >
          <div className="grid grid-cols-2 row-start-1 col-span-8 gap-x-4">
            <select
              name="platform"
              id="platform"
              className="bg-compBlue p-4 rounded-xl h-full w-full col-span-1"
              onChange={(e) => {
                setPlatform(e.target.value);
              }}
            >
              <option value="" selected>
                <div className="">Select platform</div>
              </option>
              <option value="americas">Americas</option>
              <option value="asia">Asia</option>
              <option value="europe">Europe</option>
              <option value="sea">SEA</option>
            </select>
            <select
              name="region"
              id="region"
              className="bg-compBlue p-4 rounded-xl h-full w-full col-span-1"
              onChange={(e) => {
                setRegion(e.target.value);
              }}
            >
              {platform === "" && (
                <>
                  <option value="" selected>
                    Region
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

          <div className="row-start-2 col-span-8 gap-x-4 flex items-center">
            <Input
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              className="w-full border-none bg-compBlue rounded-xl p-4"
              onTouchStart={(e) => {
                e.preventDefault();
              }}
            />
            <button
              type="submit"
              value="search"
              className="h-full flex justify-center items-center"
            >
              <Search size={28} />
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
}

export { Nav };
