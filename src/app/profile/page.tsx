"use client";

import React, { useEffect, useState } from "react";
import { getUserProfile, UserProfile } from "../actions/profile.action";
import Image from "next/image";
import { MdEdit, MdOutlineLink } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { IoIosLink } from "react-icons/io";
import { CalendarRange } from "lucide-react";
const roboto = Inter({ subsets: ["latin"] });


const bannerImages = [
  "/banner1.png",
  "/banner2.png",
  "/banner3.png",
  "/banner4.png",
];

const getABannerImage = () => {
  const randomIndex = Math.floor(Math.random() * bannerImages.length);
  return bannerImages[randomIndex];
};

const LoadingSkeleton = () => {
  return (
    <div className="w-full p-12 bg-neutral-900 rounded-lg border border-neutral-800 shadow-[4px_4px_4px_rgba(0,0,0,0.1),-4px_-4px_4px_rgba(0,0,0,0.08)]">
      {/* Banner skeleton */}
      <div className="h-28 relative rounded-2xl bg-neutral-800 animate-pulse">
        <div className="absolute left-8 -bottom-10 w-20 h-20 rounded-full bg-neutral-800 shadow-[4px_4px_8px_rgba(0,0,0,0.5),-4px_-4px_8px_rgba(255,255,255,0.03)]"></div>
      </div>

      {/* Profile info skeleton */}
      <div className="flex w-full items-center justify-between mt-12">
        <div className="flex flex-col gap-2">
          <div className="h-5 w-32 bg-neutral-800 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-neutral-800 rounded animate-pulse"></div>
        </div>
        <div className="h-9 w-28 bg-neutral-800 rounded-2xl animate-pulse shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.03)]"></div>
      </div>

      {/* Description skeleton */}
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full bg-neutral-800 rounded animate-pulse"></div>
        <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse"></div>
      </div>

      {/* Links skeleton */}
      <div className="flex gap-x-6 mt-4">
        <div className="h-4 w-32 bg-neutral-800 rounded animate-pulse"></div>
        <div className="h-4 w-32 bg-neutral-800 rounded animate-pulse"></div>
      </div>

      {/* Following/Followers skeleton */}
      <div className="flex gap-x-8 mt-2">
        <div className="h-4 w-24 bg-neutral-800 rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-neutral-800 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export const Profile = () => {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const result = await getUserProfile();
      setData(result.profile);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div
        className={`w-[42rem] p-6 h-screen border-r border-l border-neutral-700 overflow-y-auto ${roboto.className}`}
      >
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div
      className={`w-[42rem] p-6 h-screen border-r border-l border-neutral-700 overflow-y-auto ${roboto.className}`}
    >
      <div className="w-full p-12 bg-neutral-900 rounded-xl border border-neutral-800 shadow-[4px_4px_4px_rgba(0,0,0,0.1),-4px_-4px_4px_rgba(0,0,0,0.08)]">
        <div className="h-28 relative rounded-2xl">
          <Image
            src={getABannerImage()}
            alt="banner"
            fill
            className="object-cover rounded-2xl"
          />

          <div className=" absolute left-8 -bottom-10">
            <img src={data?.image} alt="profile" className="rounded-full" />
          </div>
        </div>

        <div className="flex w-full items-center justify-between mt-12">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-neutral-100">{data?.name}</h1>
            <p className="text-[13px] text-neutral-500">
              {"@"}
              {data?.email?.split("@")[0]}
            </p>
          </div>

          <div className="text-[13px] text-neutral-300 px-4 py-2 bg-neutral-900 rounded-2xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.03)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(255,255,255,0.03)] cursor-pointer transition-all duration-200">
            Edit profile
          </div>
        </div>

        <div className="flex flex-col">
          <div className={`text-[13px] mt-4 text-neutral-300`}>
            {data?.description || "Simplicity is the soul of efficiency."}
          </div>

          <div className="flex w-full items-center justify-center gap-x-6 text-[12px] mt-2 text-white">
            <div className="flex gap-x-1 w-full items-center">
              <div className="flex gap-x-6  w-full">
                <div className="flex gap-x-1 items-center">
                  <MdOutlineLink
                    size={16}
                    className="-rotate-45 text-neutral-600"
                  />
                  <a
                    href={data?.website || ""}
                    className="text-[12px] text-blue-500 hover:underline"
                  >
                    {data?.website || "http://localhost:3000"}
                  </a>
                </div>
                <div className="flex gap-x-1 items-center">
                  <CalendarRange size={14} className="text-neutral-600" />
                  <span className="text-neutral-600">
                    {data?.createdAt
                      ? new Date(data.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "new"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-between mt-2">
            <div className="flex gap-x-8">
              <span className="text-[12px] text-white font-semibold">
                {data?.followingCount}{" "}
                <span className="text-neutral-600 font-medium ml-1">
                  Following
                </span>{" "}
              </span>
              <span className="text-[12px] text-white font-semibold">
                {data?.followersCount}{" "}
                <span className="text-neutral-600 font-medium ml-1">
                  Followers
                </span>{" "}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;