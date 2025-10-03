'use client'
import ParticularPost from '@/app/components/ParticularPost'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Space_Grotesk } from "next/font/google";
import PostReply from '@/app/components/PostReply';
const inter = Space_Grotesk({ subsets: ["latin"] });
const Page = () => {
    const pathname = usePathname()
    const postId = pathname.split("/").pop() ?? "";  // "123456"
  return (
    <div className={`w-[42rem] selection:bg-neutral-300/40 p-4 h-screen bg-neutral-900 border-r border-l border-neutral-800 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent hover:scrollbar-thumb-neutral-500 ${inter.className}`}>
        <ParticularPost postId={postId} />

        <PostReply postId={postId} />
    </div>
  )
}

export default Page