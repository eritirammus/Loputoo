import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Input } from "@/Components/ui/input";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import axios from "axios";

export default function Nav({
  query,
  setQuery,
  gameName,
  setGameName,
  tagline,
  setTagline,
  region,
  setRegion,
  apiData,
  setApiData,
}) {
  function handleSearch() {
    if (query) {
      let value = query.split("#");
      setGameName(value[0]);
      setTagline(value[1]);

      axios
        .get(`/api/lol/data/${region}/${value[0]}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Riot-Token": import.meta.env.VITE_LOL_API_KEY,
          },
        })
        .then((response) => {
          setApiData(response.data);
          console.log(apiData);
          if (response?.data.puuid) {
            localStorage.setItem("puuid", response.data.puuid);
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
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
          className=" col-span-8 w-full grid grid-cols-8 gap-4"
        >
          <div className="flex justify-center col-span-2 w-full">
            {/* region */}
            <select
              name="region"
              id="region"
              className="w-full bg-transparent border px-2 rounded-md"
              onChange={(e) => {
                setRegion(e.target.value);
              }}
            >
              <option value="eun1">EUNE</option>
              <option value="euw1">EUW</option>
              <option value="na1">NA</option>
            </select>
          </div>
          <div className="col-span-6 flex gap-2 w-full">
            <Input
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              className="h-full w-full"
            />
            <input
              type="submit"
              value="🔍"
              className="border rounded px-2 h-full"
            />
          </div>
        </form>
        <div className="flex justify-center col-span-2">{/* Language */}</div>
        <div className="flex justify-center col-span-2">{/* Burgir */}</div>
      </div>
    </nav>
  );
}
