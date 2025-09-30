"use server";

import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { headers } from "next/headers";

export type UserProfile = {
  id: string;
  email: string | null;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
  username: string | null;
  description: string | null;
  location: string | null;
  website: string | null;
  dateOfJoining: Date;
  createdAt: Date;
  updatedAt: Date;
  followersCount?: number;
  followingCount?: number;
};

type UpdateProfile = {
  name?: string;
  description?: string;
  location?: string;
  website?: string;
  image?: string;
};

export const getUserProfile = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { profile: null, error: "Not authenticated" };
    }

    const userProfile = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        username: true,
        location: true,
        website: true,
        description: true,
        dateOfJoining: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!userProfile) {
      return { profile: null, error: "User not found" };
    }

    return { 
      profile: {
        ...userProfile,
        followersCount: userProfile._count.followers,
        followingCount: userProfile._count.following,
      }, 
      success: true 
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { profile: null, error: "Failed to fetch profile" };
  }
};

export const updateProfile = async (data: UpdateProfile) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { profile: null, error: "Not authenticated" };
    }

    const updatedProfile = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...data,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        username: true,
        image: true,
        location: true,
        website: true,
        description: true,
        dateOfJoining: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { profile: updatedProfile, success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { profile: null, error: "Failed to update profile" };
  }
};