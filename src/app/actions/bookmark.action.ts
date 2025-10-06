'use server'
import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const toogleBookmark = async (postId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Authrorization is required" };
  }

  try {
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      });

      const bookmarksCount = await prisma.bookmark.count({
        where: {
          postId: postId,
        },
      });

      return {
        success: true,
        msg: "Bookmark Removed",
        isBookmarkAdded: false,
        bookmarksCount,
      };
    } else {
      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          postId: postId,
        },
      });

      const bookmarksCount = await prisma.bookmark.count({
        where: {
          postId: postId,
        },
      });

      return {
        success: true,
        msg: "Bookmark Added",
        isBookmarkAdded: true,
        bookmarksCount,
      };
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false, error: "Failed to toggle bookmark" };
  }
};

export const getUserBookmarkedPosts = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Authentication is required" };
  }

  try {
    const bookmarkMarkedPosts = await prisma.bookmark.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        postId: true,
      },
    });

    const bookmarkedPostIds = bookmarkMarkedPosts.map((post) => post.postId);

    return {
      success: true,
      bookmarkedPostIds,
    };
  } catch (error) {
    console.error("Error fetching bookmarked posts:", error);
    return { success: false, error: "Failed to fetch bookmarked posts" };
  }
};

export const getUserBookmarks = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Authentication is required" };
  }

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: session.user.id
      },

      include: {
        post: {
          select: {
            id: true,
            message: true,
            postImage: true,
            createdAt: true,
            user : {
              select : {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }

    })
    const bookmarkedPosts = bookmarks.map((bookmark) => bookmark.post)
    return {
      sucess: true,
      bookmarkedPosts
    }
  } catch (error) {
    console.error("Error fetching bookmarked posts:", error);
    return { success: false, error: "Failed to fetch bookmarked posts" };
  }

  
};
