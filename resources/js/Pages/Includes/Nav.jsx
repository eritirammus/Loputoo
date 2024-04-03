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
  apiData,
  setApiData,
}) {
  function handleSearch() {
    if (query) {
      let value = query.split("#");
      setGameName(value[0]);
      setTagline(value[1]);

      axios
        .get(`/api/lol/data/${value[0]}`, {
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
      <div className="grid grid-cols-12 px-7 pt-5 items-center">
        <div className="flex justify-center col-span-1">
          <Link href="/">
            <ApplicationLogo />
          </Link>
        </div>
        <div className="flex justify-center col-span-2">EUNE{/* region */}</div>
        <div className="grid col-span-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="w-full flex gap-2 h-8 "
          >
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
          </form>
        </div>
        <div className="flex justify-center col-span-2">{/* Language */}</div>
        <div className="flex justify-center col-span-2">{/* Burgir */}</div>
      </div>
    </nav>
  );
}
