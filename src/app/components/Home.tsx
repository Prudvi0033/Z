"use client";
import React from "react";
import CreatePost from "./CreatePost";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  return (
    <div className={`w-[42rem] p-4 h-screen bg-neutral-900 border-r border-l border-neutral-800 overflow-y-auto ${inter.className}`}>
        <CreatePost/>

        <div className="border w-full border-neutral-800 my-3"></div>

    </div>
    
  );
};

export default Home;
