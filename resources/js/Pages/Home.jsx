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

  function getImageColorAndInvert(url) {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // To avoid CORS issue
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image onto canvas
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      // Calculate main color (average)
      let totalR = 0,
        totalG = 0,
        totalB = 0;
      for (let i = 0; i < data.length; i += 4) {
        totalR += data[i];
        totalG += data[i + 1];
        totalB += data[i + 2];
      }
      const avgR = Math.round(totalR / (data.length / 4));
      const avgG = Math.round(totalG / (data.length / 4));
      const avgB = Math.round(totalB / (data.length / 4));
      const mainColor = rgbaColor(avgR, avgG, avgB, 0.3); // Adjust opacity here (0.5 for 50% opacity)

      // Invert image data
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
      }

      // Put inverted image data back to canvas
      ctx.putImageData(imageData, 0, 0);

      // Display original and inverted images
      const originalImage = new Image();
      originalImage.src = url;
      document.body.appendChild(originalImage);

      const invertedImage = new Image();
      invertedImage.src = canvas.toDataURL();
      document.body.appendChild(invertedImage);

      // Return main color as rgba
      console.log("Main color (rgba):", mainColor);
    };
    img.src = url;
  }

  function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbaColor(r, g, b, a) {
    const value = `rgba(${r}, ${g}, ${b}, ${a})`;

    setBadgeColor(value);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

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
        region={region}
        setRegion={setRegion}
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
            <div className="h-auto w-full overflow-hidden shadow-sm  col-span-3 grid grid-cols-1 gap-4">
              <div className="p-7 text-textPurple bg-[#1A1A22] sm:rounded-xl">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-[#1A1A22] sm:rounded-xl">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold text-textPurple">
                        Recent Matches
                      </h2>
                      <Button variant="primary">View All</Button>

                      <div className="flex items-center">
                        
                      </div>
                    </div>
                    <div className="absolute w-790 h-90 left-30 top-30 bg-[#16161C] rounded-20">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-[#1A1A22] sm:rounded-xl"></div>
                        <div className="bg-[#1A1A22] sm:rounded-xl"></div>
                        <div className="bg-[#1A1A22] sm:rounded-xl"></div>
                        <div className="bg-[#1A1A22] sm:rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
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
