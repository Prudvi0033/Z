"use client";
import React from "react";
import { Space_Grotesk } from "next/font/google";
import Notifications from "../components/Notifications";
const inter = Space_Grotesk({ subsets: ["latin"] });

const Page = () => {
  return (
    <div
      className={`w-[42rem] selection:bg-neutral-300/40 h-screen bg-neutral-900 border-r border-l border-neutral-800 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent hover:scrollbar-thumb-neutral-500 ${inter.className} overflow-x-hidden`}
    >
      <Notifications />
    </div>
  );
};

export default Page;
