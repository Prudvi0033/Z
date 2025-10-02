'use client'
import Image from "next/image";
import React from "react";
import { HiHome } from "react-icons/hi2";
import { IoNotifications } from "react-icons/io5";
import { PiBookmarkSimple } from "react-icons/pi";
import { RiUser3Fill } from "react-icons/ri";

import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
const roboto = Inter({subsets: ['latin']})

const NavbarItems = [
  {
    title: "Home",
    icon: <HiHome size={24} />,
    ref: "/",
  },
  {
    title: "Notifications",
    icon: <IoNotifications size={24} />,
    ref: "/",
  },
  {
    title: "Bookmarks",
    icon: <PiBookmarkSimple size={24} />,
    ref: "/",
  },
  {
    title: "Profile",
    icon: <RiUser3Fill size={24} />,
    ref: "/profile",
  },
];

const Navbar = () => {
    const router = useRouter()
  return (
    <div className={`w-[26rem] h-screen ${roboto.className} bg-neutral-900`}>
      <div className="flex items-center justify-center w-full px-12 py-2">
        <div className="flex flex-col items-end justify-center w-full ">
          <div >
            <Image onClick={() => router.push("/")} src="/alpha.svg" alt="alpha" width={45} height={45} className="mb-4 cursor-pointer hover:bg-white/15 p-2 rounded-full transition-colors duration-300" />

            {NavbarItems.map((item) => (
              <div key={item.title} className="mt-2 mr-7">
                <div onClick={() => router.push(`${item.ref}`)} className="flex items-center gap-x-5 text-white cursor-pointer hover:bg-white/10 p-[10px] rounded-4xl font-medium text-xl w-fit transition-colors duration-300">
                  <div>{item.icon}</div>
                  <div>{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
