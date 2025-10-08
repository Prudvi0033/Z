"use server";
import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const toogleLike = async (postId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Authentication is required" };
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return { success: false, error: "Post not found" }; // Fixed typo
    }

    const existingLike = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });

    if (existingLike) {
      await prisma.vote.delete({
        where: {
          id: existingLike.id,
        },
      });

      const voteCount = await prisma.vote.count({
        where: { postId: postId },
      });

      return {
        success: true,
        message: "Vote Removed",
        isVoted: false,
        voteCount,
      };
    } else {
      await prisma.vote.create({
        data: {
          type: "UPVOTE",
          userId: session.user.id,
          postId: postId,
        },
      });

      if (post.userId !== session.user.id) {
        await prisma.notification.create({
          data: {
            type: "LIKE",
            userId: post.userId,
            triggeredById: session.user.id,
            postId: postId,
            isRead: false,
          },
        });
      }

      const voteCount = await prisma.vote.count({
        where: { postId: postId },
      });

      return {
        success: true,
        message: "Vote added",
        isVoted: true,
        voteCount,
      };
    }
  } catch (error) {
    console.error("Error toggling vote:", error);
    return { success: false, error: "Failed to toggle vote" };
  }
};

export const getUserLikedPosts = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Authentication is required" };
  }

  try {
    const likedPosts = await prisma.vote.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        postId: true,
      },
    });

    const likedPostIds = likedPosts.map((vote) => vote.postId);

    return {
      success: true,
      likedPostIds,
    };
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return { success: false, error: "Failed to fetch liked posts" };
  }
};

export const getLikedPostsForUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Authentication is required" };
  }

  try {
    const posts = await prisma.vote.findMany({
      where: {
        userId: session.user.id,
        type: "UPVOTE",
      },
      include: {
        post: {
          select: {
            id: true,
            message: true,
            postImage: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const likedPosts = posts.map((vote) => vote.post);

    return { sucess: true, likedPosts };
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return { success: false, error: "Failed to fetch liked posts" };
  }
};
