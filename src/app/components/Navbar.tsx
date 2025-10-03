"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi2";
import { IoNotifications } from "react-icons/io5";
import { PiBookmarkSimple } from "react-icons/pi";
import { RiUser3Fill } from "react-icons/ri";
import { useRouter, usePathname } from "next/navigation";
import { PersonStanding } from "lucide-react";
import { authClient } from "../lib/auth-client";
import { FaCookie } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { motion } from "framer-motion";
import { Bitcount_Single, Space_Grotesk } from "next/font/google";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

// Add these interfaces
interface Session {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
  expires?: string;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  ref: string;
}

const roboto = Space_Grotesk({ subsets: ["latin"] }) as { className: string };

const bit = Bitcount_Single({ subsets: ["latin"] }) as { className: string };

const NavbarItems: NavItem[] = [
  { title: "Home", icon: <GoHome size={28} />, ref: "/" },
  {
    title: "Community",
    icon: <FaCookie size={24} />,
    ref: "/community",
  },
  {
    title: "Notifications",
    icon: <IoNotifications size={24} />,
    ref: "/notifications",
  },
  {
    title: "Bookmarks",
    icon: <PiBookmarkSimple size={24} />,
    ref: "/bookmarks",
  },
  { title: "Profile", icon: <RiUser3Fill size={24} />, ref: "/profile" },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);

useEffect(() => {
  const loadSession = async () => {
    const result = await authClient.getSession();
    if ("data" in result && result.data) {
      setSession(result.data);
    } else {
      setSession(null);
    }
  };
  loadSession();
}, []);

const handleSignIn = async () => {
  try {
    await authClient.signIn({ provider: "google" });
    const result = await authClient.getSession();
    if ("data" in result && result.data) {
      setSession(result.data);
    }
  } catch (err) {
    console.error("SignIn error:", err);
  }
};

const handleSignOut = async () => {
  try {
    await authClient.signOut();
    setSession(null);
    router.push("/");
  } catch (err) {
    console.error("SignOut error:", err);
  }
};


  return (
    <div className={`w-[26rem] h-screen ${roboto.className} bg-neutral-900`}>
      <div className="flex items-center justify-end w-full px-12 py-6">
        <div className="flex flex-col items-end w-fit">
          {/* Logo */}
          <motion.div
            className={`${bit.className} p-4 mb-20 text-white text-4xl flex w-full items-start`}
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.3) 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
            animate={{
              backgroundPosition: ["200% 0", "-200% 0"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Alpha
          </motion.div>

          {/* Navigation */}
          {NavbarItems.map((item) => {
            const isActive = pathname === item.ref;
            return (
              <div
                key={item.title}
                onClick={() => router.push(item.ref)}
                className={`flex items-center gap-x-5 cursor-pointer py-3 px-6 w-full rounded-lg font-medium text-lg mb-2 transition-colors duration-300
                  ${
                    isActive
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/10"
                  }`}
              >
                <div>{item.icon}</div>
                <div>{item.title}</div>
              </div>
            );
          })}

          {/* Auth Button */}
          <div className="mt-32 relative">
            {/* Background TextHoverEffect */}
            <div className="w-full h-fit absolute bottom-8 px-2">
              <TextHoverEffect text="Alpha" duration={0.3} />
            </div>
            
            {session ? (
              <button
                onClick={handleSignOut}
                className="py-3 px-18 rounded-xl cursor-pointer bg-gradient-to-br from-neutral-100 to-white text-black font-semibold transition-all duration-200 shadow-[6px_6px_12px_rgba(0,0,0,0.4),-6px_-6px_12px_rgba(255,255,255,0.05)] active:scale-95 relative z-10"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="py-3 px-18 rounded-xl cursor-pointer bg-gradient-to-br from-neutral-100 to-white text-black font-semibold transition-all duration-200 shadow-[6px_6px_12px_rgba(0,0,0,0.4),-6px_-6px_12px_rgba(255,255,255,0.05)] active:scale-95 relative z-10"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
