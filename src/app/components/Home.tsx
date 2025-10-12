"use client";
import React, { useState } from "react";
import CreatePost from "./CreatePost";
import { Space_Grotesk } from "next/font/google";
import Posts from "./Posts";
const inter = Space_Grotesk({ subsets: ["latin"] });


const Home = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev+1)
  }
  return (
    <div className={`w-[42rem] selection:bg-neutral-300/40 p-4 h-screen bg-neutral-900 border-r border-l border-neutral-800 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent hover:scrollbar-thumb-neutral-500 ${inter.className}`}>
        <CreatePost onPostCreated={handlePostCreated} />

        <div className="border w-full border-neutral-800 my-3"></div>

        <Posts refreshTrigger={refreshTrigger} />
    </div>
    
  );
};

export default Home;
