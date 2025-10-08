'use client'
import React from 'react'
import Followers from '../components/Followers'
import { Space_Grotesk } from 'next/font/google';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
const inter = Space_Grotesk({ subsets: ["latin"] });

const Page = () => {
    const router = useRouter()
  return (
    <div className={`w-[42rem] selection:bg-neutral-300/40 h-screen bg-neutral-900 border-r border-l border-neutral-800 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent hover:scrollbar-thumb-neutral-500 ${inter.className}`}>
        <div className="flex gap-x-6 text-xl text-neutral-100 px-8 items-center h-12 w-full bg-neutral-700/20 border-b border-neutral-800">
                <FaArrowLeft
                  onClick={() => {
                    router.back();
                  }}
                  size={16}
                  className="cursor-pointer"
                />
                <span>Community</span>
              </div>
        
        <div className='p-12'>
            <Followers/>
        </div>
    </div>
  )
}

export default Page