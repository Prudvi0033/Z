"use server";

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const getNotifications = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "User is not authorized" };
  }

  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { userId: session.user.id },         
        { triggeredById: session.user.id },  
      ],
    },
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
      triggeredBy: { select: { id: true, name: true, username: true, image: true } },
      post: { select: { id: true, message: true } },
      comment: { select: { id: true, description: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return { success: true, notifications };
};

export const getUnreadNotificationCount = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "User is not authorized" };
  }

  try {
    const unreadNotificationCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    });

    return { success: true, unreadNotificationCount };
  } catch (error) {
    console.error("Error in getting count of unread notifications:", error);
    return { success: false, error: "Failed to get unread notification count" };
  }
};



export const markAllnotificationsAsRead = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { sucess: false, error: "User is not authorized" };
  }

  try {
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return { success: true, message: "Read all the notifications" };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false, error: "Failed to mark notifications as read" };
  }
};
