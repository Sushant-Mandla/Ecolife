import React from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const { pathname } = useLocation();
  const isFixedAssistantPage = pathname === "/chat" || pathname === "/ecobot";

  return (
    <div className={`${isFixedAssistantPage ? "h-screen overflow-hidden" : "min-h-screen"} flex flex-col`}>
      <div className="sticky top-0 z-30">
        <Navbar />
      </div>
      <main className={`flex-1 min-h-0 flex flex-col${isFixedAssistantPage ? " overflow-hidden" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;