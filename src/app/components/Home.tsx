"use client";
import React from "react";
import CreatePost from "./CreatePost";
import { Inter, Space_Grotesk } from "next/font/google";
import Posts from "./Posts";
const inter = Space_Grotesk({ subsets: ["latin"] });


const Home = () => {
  return (
    <div className={`w-[42rem] selection:bg-neutral-50 p-4 h-screen bg-neutral-900 border-r border-l border-neutral-800 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent hover:scrollbar-thumb-neutral-500 ${inter.className}`}>
        <CreatePost/>

        <div className="border w-full border-neutral-800 my-3"></div>

        <Posts/>
    </div>
    
  );
};

export default Home;
