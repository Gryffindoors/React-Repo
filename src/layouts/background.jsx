// src/layout/Background.jsx
import React from "react";
import { useLocation } from "react-router";
import LogoBadge from "./logoBadge";
import LogoutButton from "../components/LogoutButton";
import { NAVBAR_TYPE } from "../nav/NavbarCentral";
import SideNav from "../nav/SideNav";
import TopNav from "../nav/TopNav";

export default function Background({ children }) {
  const location = useLocation();

  // Hide logout button on login page
  const hideLogout = location.pathname === "/login";

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 relative overflow-hidden flex flex-col">
      {/* ✅ Top navigation bar (always visible, neutral styling) */}
      <div className="w-full h-14 bg-gray-800 flex items-center justify-between px-4 shadow-md z-20">
        <LogoBadge />

        <h1 className="text-lg font-semibold tracking-wide text-white text-center flex-1">
          Your App Title
        </h1>

        {!hideLogout && <LogoutButton />}
      </div>

      {/* ✅ Conditional Navbars */}
      {NAVBAR_TYPE === "side" && (
        <div className="flex flex-1">
          <SideNav visible />
          <main className="flex-1 px-4 sm:px-6 md:px-8 pt-4">{children}</main>
        </div>
      )}

      {NAVBAR_TYPE === "top" && (
        <>
          <TopNav visible />
          <main className="flex-1 px-4 sm:px-6 md:px-8 pt-4">{children}</main>
        </>
      )}
    </div>
  );
}
