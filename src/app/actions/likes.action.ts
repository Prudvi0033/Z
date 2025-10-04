"use server";

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { VoteType } from "@prisma/client";

export const toogleLike = async (postId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized User" };
  }

  try {
    const isLiked = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });

    if (isLiked) {
      await prisma.vote.delete({
        where: {
          id: isLiked.id,
        },
      });

      return { success: true, action: "unliked" };
    } else {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          userId: true,
        },
      });

      if (!post) {
        return { success: false, error: "Post not found" };
      }

      await prisma.vote.create({
        data: {
          type: VoteType.UPVOTE,
          userId: session.user.id,
          postId: postId,
        },
      });

      return { success: true, action: "liked" };
    }
  } catch (error) {
    console.error("Error toggling post like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
};

export const getAllPosts = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized User" };
    }

    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
            bookmarks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add computed fields for current user
    const postsWithDetails = posts.map((post) => ({
      ...post,
      hasLiked: session?.user
        ? post.votes.some(
            (vote) =>
              vote.userId === session.user.id && vote.type === VoteType.UPVOTE
          )
        : false,
      likesCount: post.votes.filter((vote) => vote.type === VoteType.UPVOTE)
        .length,
    }));

    return { success: true, allPosts: postsWithDetails };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false, error: "Failed to fetch posts" };
  }
};

export const getPostById = async (postId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized User" };
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    const postWithDetails = {
      ...post,
      hasLiked: session?.user
        ? post.votes.some(
            (vote) =>
              vote.userId === session.user.id && vote.type === VoteType.UPVOTE
          )
        : false,
      likesCount: post.votes.filter((vote) => vote.type === VoteType.UPVOTE)
        .length, // ← This!
    };

    return {
      success: true,
      postWithDetails,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { success: false, error: "Failed to fetch post" };
  }
};
