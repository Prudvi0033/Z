"use client";
import React, { useState } from "react";
import Profile from "../components/Profile";
import { Space_Grotesk } from "next/font/google";
import { IoMdGrid } from "react-icons/io";
import { MdFavoriteBorder } from "react-icons/md";
import UserPosts from "../components/UserPosts";
const roboto = Space_Grotesk({ subsets: ["latin"] });
const Page = () => {
  const [activeTab, setActiveTab] = useState("grid");
  const [isPost, setIsPosts] = useState(true);
  return (
    <div
      className={`flex flex-col w-[42rem] p-6 h-screen border-r border-l border-neutral-700 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent hover:scrollbar-thumb-neutral-500 ${roboto.className}`}
    >
      <Profile />

      <div className="border-b border-neutral-800 flex mt-12">
        <div className="flex w-full">
          <button
            onClick={() => setActiveTab("grid")}
            className={`
            flex-1 flex items-center justify-center py-2
            transition-all duration-200
            hover:bg-white/10
            ${
              activeTab === "grid"
                ? "border-b-2 border-white"
                : "border-b-2 border-transparent"
            }
          `}
          >
            <IoMdGrid size={32} className="text-white" />
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`
            flex-1 flex items-center justify-center py-2
            transition-all duration-200
            hover:bg-white/10
            ${
              activeTab === "favorites"
                ? "border-b-2 border-white"
                : "border-b-2 border-transparent"
            }
          `}
          >
            <MdFavoriteBorder size={32} className="text-white" />
          </button>
        </div>
      </div>

      {isPost ? (
        <div>
          <UserPosts/>
        </div>
      ) : (
        <div>

        </div>
      )}
    </div>
  );
};

export default Page;