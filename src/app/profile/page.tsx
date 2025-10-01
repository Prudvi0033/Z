"use client";

import React, { useEffect, useState } from "react";
import { getUserProfile, UserProfile } from "../actions/profile.action";
import { Bitcount_Grid_Double } from "next/font/google";
import Image from "next/image";
import { MdEdit } from "react-icons/md";
import { FaLink } from "react-icons/fa";

const bit = Bitcount_Grid_Double({ subsets: ["latin"] });

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
    <div className="w-[42rem] h-screen border-r border-l border-neutral-700 overflow-y-auto">
      <div className="flex flex-col">
        <div className="h-44 relative w-full">
          <Image
            src="/banner.png"
            alt="banner"
            width={700}
            height={700}
            className="object-cover"
          />

          <Image
            src={data?.image || "/default-avatar.png"}
            alt="image"
            height={150}
            width={150}
            className="absolute left-4 -bottom-28 rounded-full p-0.5 border border-gray-600"
          />
        </div>

        <div className="mt-32 px-4">
          <div className="flex w-full items-center justify-between">
            <div>
              <div className="text-white font-bold text-xl">{data?.name}</div>
            <p className="text-neutral-500 text-[16px]">{" "}@{data?.email?.split("@")[0]}</p>
            </div>
            <div className="border border-white p-2 rounded-full">
              <MdEdit size={24} className="text-white" />
            </div>
          </div>

          <div className="mt-4 text-[16px]">
            {data?.description || "I am an alpha"}
          </div>

          <div className="flex">
            <div className="flex items-center justify-center gap-2">
              <FaLink size={12} />
              <a className="">{data?.website || "https://localhost:3000"}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
