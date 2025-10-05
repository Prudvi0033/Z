"use client";
import React, { useState } from "react";
import Profile from "../components/Profile";
import { Space_Grotesk } from "next/font/google";
import { IoMdGrid } from "react-icons/io";
import { MdFavoriteBorder } from "react-icons/md";
import UserPosts from "../components/UserPosts";
import UserLikedPosts from "../components/UserLikedPosts";
const roboto = Space_Grotesk({ subsets: ["latin"] });
const Page = () => {
  const [activeTab, setActiveTab] = useState("posts");
  return (
    <div
      className={`flex flex-col w-[42rem] p-6 h-screen border-r border-l border-neutral-700 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent hover:scrollbar-thumb-neutral-500 ${roboto.className}`}
    >
      <Profile />

      <div className="border-b border-neutral-800 flex mt-12">
        <div className="flex w-full">
          <button
            onClick={() => setActiveTab("posts")}
            className={`
            flex-1 flex items-center justify-center py-2
            transition-all duration-200
            hover:bg-white/10
            ${
              activeTab === "posts"
                ? "border-b-2 border-neutral-300"
                : "border-b-2 border-transparent"
            }
          `}
          >
            <IoMdGrid size={28} className="text-neutral-300" />
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`
            flex-1 flex items-center justify-center py-2
            transition-all duration-200
            hover:bg-white/10
            ${
              activeTab === "favorites"
                ? "border-b-2 border-neutral-300"
                : "border-b-2 border-transparent"
            }
          `}
          >
            <MdFavoriteBorder size={28} className="text-neutral-300" />
          </button>
        </div>
      </div>

      {activeTab === "posts" ? (
        <div>
          <UserPosts/>
        </div>
      ) : (
        <div>
          <UserLikedPosts/>
        </div>
      )}
    </div>
  );
};

export default Page;