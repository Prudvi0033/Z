"use client";

import React, { useEffect, useState } from "react";
import { getUserProfile, UserProfile } from "../actions/profile.action";
import Image from "next/image";
import { MdEdit, MdOutlineLink } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

import { useRouter } from "next/navigation";
import { Inter, Lobster } from "next/font/google";
import { IoIosLink } from "react-icons/io";
import { CalendarRange } from "lucide-react";
const roboto = Inter({ subsets: ["latin"] });

const lob = Lobster({ subsets: ["latin"], weight: ["400"] });

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

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className={`w-[42rem] p-6 h-screen border-r border-l border-neutral-700 overflow-y-auto ${roboto.className}`}
    >
      <div className="w-full border p-12 border-neutral-800 bg-neutral-900/90 shadow-sm shadow-white/5 rounded-lg">
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
            <h1 className="text-sm font-semibold">{data?.name}</h1>
            <p className="text-[12px] text-neutral-600">
              {"@"}
              {data?.email?.split("@")[0]}
            </p>
          </div>

          <div className="text-[12px] text-white px-2 py-1 border border-neutral-300 rounded-2xl hover:bg-white/20 cursor-pointer">
            Edit profile
          </div>
        </div>

        <div className="flex flex-col">
          <div className={`text-[12px] mt-4 `}>
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
                  <CalendarRange
                    size={14}
                    className="text-neutral-600"
                  />
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
