"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { checkAndAwardAchievements } from "./achievements";
import { earnGamerCoin } from "./economy";

export async function getChatMessages(limit = 50) {
  try {
    const msgs = await db.globalChat.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            role: true,
            level: true,
          },
        },
      },
    });
    // Return in chronological order
    return msgs.reverse();
  } catch (error) {
    console.error("Failed to fetch chat messages:", error);
    return [];
  }
}

export async function sendChatMessage(content: string) {
  const session = await getSession();
  if (!session) return { error: "Nincs bejelentkezve!" };
  if (!content || content.trim().length === 0) return { error: "Üres üzenet!" };
  if (content.length > 300) return { error: "Túl hosszú üzenet!" };

  try {
    // Basic formatting
    const isSpecial = session.role === "ADMIN" && content.startsWith("/shout ");
    const actualContent = isSpecial ? content.replace("/shout ", "") : content.trim();

    const msg = await db.globalChat.create({
      data: {
        userId: session.id,
        content: actualContent,
        isSpecial,
      },
    });

    await checkAndAwardAchievements(session.id); // Gamification Badge check
    await earnGamerCoin(2); // Earn 2 GamerCoins for chatting

    revalidatePath("/chat");
    return { success: true, message: msg };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { error: "Kiszolgáló hiba az üzenet küldésekor." };
  }
}
