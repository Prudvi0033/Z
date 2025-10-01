"use server";

import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { headers } from "next/headers";

export const createComment = async (postId: string, description: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Authentication is required" };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return { success: false, error: "Post not found" };
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        description: description,
        userId: session.user.id,
        postId: postId,
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
    return { success: true, comment };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { success: false, error: "Failed to create comment" };
  }
};

export const deleteComment = async (commentId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Authentication is required" };
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) {
      return { success: false, error: "No comment found" };
    }

    if (comment.userId !== session.user.id) {
      return { success: false, error: "You can't delete this comment" };
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return { success: true, message: "Comment deleted successfully" };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, error: "Failed to delete comment" };
  }
};

export const getPostComments = async (postId: string) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, comments };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { success: false, error: "Failed to fetch comments" };
  }
};
