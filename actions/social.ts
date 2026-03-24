"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { addXP } from "@/lib/xp";

// ========================
// 1. KÖVETÉS (FOLLOWING)
// ========================
export async function toggleFollow(targetUserId: string) {
  const session = await getSession();
  if (!session?.id) return { error: "Bejelentkezés szükséges!" };
  if (session.id === targetUserId) return { error: "Nem követheted magad!" };

  const existing = await db.follow.findUnique({
    where: { followerId_followingId: { followerId: session.id, followingId: targetUserId } },
  });

  if (existing) {
    await db.follow.delete({ where: { id: existing.id } });
  } else {
    await db.follow.create({
      data: { followerId: session.id, followingId: targetUserId },
    });
  }

  revalidatePath(`/profil/${targetUserId}`);
  revalidatePath(`/profil`);
  return { success: true, isFollowing: !existing };
}

// ========================
// 2. PRIVÁT ÜZENETEK (DM)
// ========================
export async function sendDirectMessage(receiverId: string, content: string) {
  const session = await getSession();
  if (!session?.id) return { error: "Nincs jogosultságod!" };
  if (content.trim().length === 0) return { error: "Üres üzenet!" };

  await db.directMessage.create({
    data: {
      senderId: session.id,
      receiverId,
      content,
    },
  });

  revalidatePath(`/chat/${receiverId}`);
  return { success: true };
}

export async function markMessagesAsRead(senderId: string) {
  const session = await getSession();
  if (!session?.id) return;

  await db.directMessage.updateMany({
    where: { senderId, receiverId: session.id, readAt: null },
    data: { readAt: new Date() },
  });
}

// ========================
// 3. KÖZÖSSÉGEK (GUILDS)
// ========================
export async function createGuild(name: string, description: string) {
  const session = await getSession();
  if (!session?.id) return { error: "Bejelentkezés szükséges!" };

  const existing = await db.guild.findUnique({ where: { name } });
  if (existing) return { error: "Ez a név már foglalt!" };

  const guild = await db.guild.create({
    data: {
      name,
      description,
      members: {
        create: { userId: session.id, role: "FOUNDER" },
      },
    },
  });

  revalidatePath("/guilds");
  return { success: true, guildId: guild.id };
}

export async function joinGuild(guildId: string) {
  const session = await getSession();
  if (!session?.id) return { error: "Bejelentkezés szükséges!" };

  const existing = await db.guildMember.findUnique({
    where: { userId_guildId: { userId: session.id, guildId } },
  });

  if (existing) {
    // Leave
    await db.guildMember.delete({ where: { id: existing.id } });
  } else {
    // Join
    await db.guildMember.create({
      data: { userId: session.id, guildId },
    });
  }

  revalidatePath(`/guilds/${guildId}`);
  revalidatePath("/guilds");
  return { success: true };
}

export async function sendGuildMessage(guildId: string, content: string) {
  const session = await getSession();
  if (!session?.id) return { error: "Nincs jogosultságod!" };
  if (content.trim().length === 0) return { error: "Üres üzenet!" };

  const member = await db.guildMember.findUnique({
    where: { userId_guildId: { userId: session.id, guildId } },
  });
  if (!member) return { error: "Nem vagy tagja a klánnak!" };

  await db.guildChat.create({
    data: {
      guildId,
      userId: session.id,
      content,
    },
  });

  revalidatePath(`/guilds/${guildId}`);
  return { success: true };
}

// ========================
// 4. KUDOS / UPVOTES
// ========================
export async function toggleCommentUpvote(commentId: string) {
  const session = await getSession();
  if (!session?.id) return { error: "Jelentkezz be az értékeléshez!" };

  const existing = await db.upvote.findUnique({
    where: { userId_commentId: { userId: session.id, commentId } },
  });

  if (existing) {
    await db.upvote.delete({ where: { id: existing.id } });
    
    // Nem kötelező visszavenni XP-t de opcionálisan meg lehet tenni
    const com = await db.comment.findUnique({ where: { id: commentId } });
    if (com?.userId) {
      await addXP(com.userId, -2);
    }
  } else {
    await db.upvote.create({
      data: { userId: session.id, commentId },
    });
    
    // Adjuk meg az XP-t a komment írójának (RP pontszám)
    const com = await db.comment.findUnique({ where: { id: commentId } });
    if (com?.userId && com.userId !== session.id) {
      await addXP(com.userId, 2);
    }
  }

  revalidatePath("/hirek/[slug]", "page");
  return { success: true };
}
