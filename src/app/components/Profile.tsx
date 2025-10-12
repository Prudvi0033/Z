"use client";

import React, { useEffect, useState } from "react";
import { getUserProfile, updateProfile, UserProfile } from "../actions/profile.action";
import Image from "next/image";
import { MdOutlineLink } from "react-icons/md";
import { CalendarRange, Loader2} from "lucide-react";
import { TiLocationOutline } from "react-icons/ti";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Space_Grotesk } from "next/font/google";

const bannerImages = [
  "/banner1.png",
  "/banner2.png",
  "/banner3.png",
  "/banner4.png",
];

const space = Space_Grotesk({subsets: ['latin']})

const getABannerImage = () => {
  const randomIndex = Math.floor(Math.random() * bannerImages.length);
  return bannerImages[randomIndex];
};

const LoadingSkeleton = () => {
  return (
    <div className="w-full p-12 bg-neutral-900 rounded-lg border border-neutral-800 shadow-[4px_4px_4px_rgba(0,0,0,0.1),-4px_-4px_4px_rgba(0,0,0,0.08)]">
      <div className="h-28 relative rounded-2xl bg-neutral-800 animate-pulse">
        <div className="absolute left-8 -bottom-10 w-20 h-20 rounded-full bg-neutral-800 shadow-[4px_4px_8px_rgba(0,0,0,0.5),-4px_-4px_8px_rgba(255,255,255,0.03)]"></div>
      </div>

      <div className="flex w-full items-center justify-between mt-12">
        <div className="flex flex-col gap-2">
          <div className="h-5 w-32 bg-neutral-800 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-neutral-800 rounded animate-pulse"></div>
        </div>
        <div className="h-9 w-28 bg-neutral-800 rounded-2xl animate-pulse shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.03)]"></div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-4 w-full bg-neutral-800 rounded animate-pulse"></div>
        <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse"></div>
      </div>

      <div className="flex gap-x-6 mt-4">
        <div className="h-4 w-32 bg-neutral-800 rounded animate-pulse"></div>
        <div className="h-4 w-32 bg-neutral-800 rounded animate-pulse"></div>
      </div>

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const result = await getUserProfile();
      setData(result.profile);
      if (result.profile) {
        setEditForm({
          name: result.profile.name || "",
          description: result.profile.description || "",
          website: result.profile.website || "",
          location: result.profile.location || "",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    if (data) {
      setEditForm({
        name: data.name || "",
        description: data.description || "",
        website: data.website || "",
        location: data.location || "",
      });
    }
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile(editForm);
      if (result.success && result.profile) {
        setData({
          ...data!,
          ...result.profile,
        });
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div className="w-full p-12 bg-neutral-900 rounded-xl border border-neutral-800 shadow-[4px_4px_4px_rgba(0,0,0,0.1),-4px_-4px_4px_rgba(0,0,0,0.08)]">
        <div className="h-28 relative rounded-2xl">
          <Image
            src={getABannerImage()}
            alt="banner"
            fill
            className="object-cover rounded-2xl"
          />

          <div className=" absolute left-8 -bottom-10">
            <Image src={data?.image || ""} alt="profile" width={90} height={90} className="rounded-full" />
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

          <div 
            onClick={handleEditClick}
            className="text-[13px] text-neutral-300 px-4 py-2 bg-neutral-900 rounded-2xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.03)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(255,255,255,0.03)] cursor-pointer transition-all duration-200"
          >
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
                  <TiLocationOutline className="text-neutral-600" />
                  <span className="text-neutral-200">{data?.location || "Valhalla"}</span>
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className={`bg-neutral-900 border border-neutral-800 text-neutral-100 max-w-xl ${space.className}`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-neutral-100">Edit profile</DialogTitle>
            <div className="border w-full border-neutral-800"></div>
          </DialogHeader>
          
          <div className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[13px] text-neutral-300">
                Name
              </Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-neutral-100 focus:border-neutral-600 focus:ring-neutral-600"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[13px] text-neutral-300">
                Bio
              </Label>
              <Input
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-neutral-100 focus:border-neutral-600 focus:ring-neutral-600"
                placeholder="Tell us about yourself"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-[13px] text-neutral-300">
                Location
              </Label>
              <Input
                id="location"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-neutral-100 focus:border-neutral-600 focus:ring-neutral-600"
                placeholder="Where are you based?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-[13px] text-neutral-300">
                Website
              </Label>
              <Input
                id="website"
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-neutral-100 focus:border-neutral-600 focus:ring-neutral-600"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-6 py-2 bg-white text-neutral-900 font-semibold rounded-full hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 size={20} className="animate-spin" /> : "Save changes"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;