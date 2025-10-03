"use client";
import ParticularPost from "@/app/components/ParticularPost";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Space_Grotesk } from "next/font/google";
import PostReply from "@/app/components/PostReply";
import PostComments from "@/app/components/PostComments";
import { FaArrowLeft } from "react-icons/fa";
const inter = Space_Grotesk({ subsets: ["latin"] });
const Page = () => {
  const pathname = usePathname();
  const route = useRouter()
  const postId = pathname.split("/").pop() ?? ""; // "123456"
  return (
    <div
      className={`w-[42rem] selection:bg-neutral-300/40 h-screen bg-neutral-900 border-r border-l border-neutral-800 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent hover:scrollbar-thumb-neutral-500 ${inter.className}`}
    >
      <div className="flex gap-x-6 text-xl text-neutral-100 px-8 items-center h-12 w-full bg-neutral-700/20 border-b border-neutral-800">
        <FaArrowLeft onClick={() => {route.back()}} size={16} className="cursor-pointer" />
        <span>Posts</span>
      </div>

      <div className="px-4">
        <ParticularPost postId={postId} />

        <PostReply postId={postId} />

        <PostComments postId={postId} />
      </div>
    </div>
  );
};

export default Page;
