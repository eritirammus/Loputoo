import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Input } from "@/Components/ui/input";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";

export default function Authenticated({ user, header, children }) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  return (
    <div className="min-h-screen bg-bgBlue text-white">
      <nav className="bg-bgBlue">
        <div className="grid grid-cols-12 px-7 pt-5 items-center">
          <div className="flex justify-center col-span-1">
            <Link href="/">
              <ApplicationLogo />
            </Link>
          </div>
          <div className="flex justify-center col-span-2">EUNE{/* region */}</div>
          <div className="grid col-span-6">
            <Input />
          </div>
          <div className="flex justify-center col-span-2">{/* Language */}</div>
          <div className="flex justify-center col-span-2">{/* Burgir */}</div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
