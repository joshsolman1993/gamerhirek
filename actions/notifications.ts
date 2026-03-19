"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getUnreadNotifications() {
  const session = await getSession();
  if (!session) return [];

  try {
    const notifications = await db.notification.findMany({
      where: {
        userId: session.id,
        isRead: false,
      },
      orderBy: { createdAt: "desc" },
    });
    return notifications;
  } catch (error) {
    console.error("Failed to fetch notifications", error);
    return [];
  }
}

export async function markAsRead(notificationId: string) {
  const session = await getSession();
  if (!session) return { success: false };

  try {
    await db.notification.update({
      where: {
        id: notificationId,
        userId: session.id, // security check
      },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to mark as read", error);
    return { success: false };
  }
}

export async function markAllAsRead() {
  const session = await getSession();
  if (!session) return { success: false };

  try {
    await db.notification.updateMany({
      where: {
        userId: session.id,
        isRead: false,
      },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all as read", error);
    return { success: false };
  }
}

// Internal utility to create a notification purely from server side
export async function createNotification(userId: string, message: string, link?: string) {
  try {
    await db.notification.create({
      data: {
        userId,
        message,
        link,
      },
    });
  } catch (error) {
    console.error("Failed to create notification", error);
  }
}
