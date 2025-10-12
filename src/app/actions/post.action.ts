"use server";

import { headers } from "next/headers";

import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const createPost = async (message: string, postImage?: string) => {
  const seesion = await auth.api.getSession({
    headers: await headers(),
  });

  if (!seesion) {
    return { success: false, error: "Authentication is required" };
  }

  try {
    const post = await prisma.post.create({
      data: {
        message: message,
        postImage: postImage,
        userId: seesion.user.id,
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
      },
    });

    return { success: true, post }; // ✅ Fixed typo
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
};

export const deletePost = async (postId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Authentication is required" };
  }

  try {
    const userPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!userPost) {
      return { success: false, error: "Post not found" }; // ✅ Fixed typo
    }

    if (userPost.userId !== session.user.id) {
      return { success: false, error: "Can't delete this post" };
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "Failed to delete post" };
  }
};

export const getUserPosts = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Authentication is required" };
  }

  try {
    const userPosts = await prisma.post.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
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
    return { success: true, userPosts }; // ✅ Fixed typo
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return { success: false, error: "Failed to fetch posts" };
  }
};

export const getAllPosts = async () => {
  try {
    const allPosts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
            bookmarks: true,
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, allPosts };
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return { success: false, error: "Failed to fetch posts" };
  }
};

export const getPostById = async (postId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Authentication is required" };
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
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

    return { success: true, post };
  } catch (error) {
    console.error("Error fetching post by id:", error);
    return { success: false, error: "Failed to fetch post" };
  }
};