import { useState, useContext } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Input } from "@/Components/ui/input";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import axios from "axios";
import { Toaster } from "@/Components/ui/sonner";

export default function Authenticated({ user, header, children }) {
  return (
    <div className="min-h-screen bg-bgBlue text-white">
      <main>{children}</main>
      <Toaster richColors/>
    </div>
  );
}
