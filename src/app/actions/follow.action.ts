"use server";

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const getAllUsers = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Authentication is required" };
  }

  try {
    const allUsers = await prisma.user.findMany({
      where: {
        id: {
          not: session.user.id,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        description: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
        followers: {
          where: {
            followerId: session.user.id,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const usersWithFollowStatus = allUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      description: user.description,
      isFollowing: user.followers.length > 0,
      _count: user._count,
    }));

    return { success: true, users: usersWithFollowStatus };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
};

export const toggleFollow = async (userId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Authentication is required" };
  }

  if (session.user.id === userId) {
    return { success: false, error: "You cannot follow yourself" };
  }

  try {
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,    
          followingId: userId,             
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });
      return {
        success: true,
        message: "User unfollowed successfully",
        action: "unfollowed",
      };
    } else {
      await prisma.follow.create({
        data: {
          followerId: session.user.id,    
          followingId: userId,             
        },
      });

      await prisma.notification.create({
        data: {
          type: "FOLLOW",
          userId: session.user.id,
          triggeredById: userId,
          isRead: false
        }
      })

      return {
        success: true,
        message: "User followed successfully",
        action: "followed",
      };
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    return { success: false, error: "Failed to toggle follow" };
  }
};
