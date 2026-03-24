"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { addXP } from "@/lib/xp";

async function verifyAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

// User Management
export async function updateUser(userId: string, data: { xp?: number; role?: string }) {
  await verifyAdmin();
  await db.user.update({
    where: { id: userId },
    data,
  });
  revalidatePath("/admin/users");
  revalidatePath("/profil");
  return { success: true };
}

// Moderation
export async function deleteComment(id: string) {
  await verifyAdmin();
  await db.comment.delete({ where: { id } });
  revalidatePath("/admin/moderation");
  return { success: true };
}

export async function deleteGlobalChat(id: string) {
  await verifyAdmin();
  await db.globalChat.delete({ where: { id } });
  revalidatePath("/admin/moderation");
  revalidatePath("/chat");
  return { success: true };
}

// Gamification (Quiz)
export async function createQuiz(data: {
  title: string;
  description?: string;
  xpReward: number;
  questions: {
    text: string;
    imageUrl?: string;
    options: { text: string; isCorrect: boolean }[];
  }[];
}) {
  await verifyAdmin();
  await db.quiz.create({
    data: {
      title: data.title,
      description: data.description || null,
      xpReward: data.xpReward,
      isActive: true, // Auto set active on creation
      questions: {
        create: data.questions.map(q => ({
          text: q.text,
          imageUrl: q.imageUrl || null,
          options: {
            create: q.options
          }
        }))
      }
    },
  });
  revalidatePath("/admin/quiz");
  revalidatePath("/trivia");
  return { success: true };
}

export async function deleteQuiz(id: string) {
  await verifyAdmin();
  await db.quiz.delete({ where: { id } });
  revalidatePath("/admin/quiz");
  revalidatePath("/trivia");
  return { success: true };
}

export async function createMatch(data: {
  teamA: string;
  teamB: string;
  format: string;
  startTime: string;
}) {
  await verifyAdmin();
  await db.match.create({
    data: {
      teamA: data.teamA,
      teamB: data.teamB,
      format: data.format,
      startTime: new Date(data.startTime),
      status: "SCHEDULED",
    },
  });
  revalidatePath("/admin/matches");
  revalidatePath("/pro-scene");
  return { success: true };
}

export async function updateMatchResult(matchId: string, winner: string) {
  await verifyAdmin();
  await db.match.update({
    where: { id: matchId },
    data: { winner, status: "COMPLETED" },
  });

  // E-sport Phase 10: Reward fans of the winning team with extra XP
  const fans = await db.user.findMany({ where: { favoriteTeam: winner } });
  for (const fan of fans) {
    await addXP(fan.id, 100);
  }

  revalidatePath("/admin/matches");
  revalidatePath("/pro-scene/pickem");
  return { success: true };
}

export async function deleteMatch(id: string) {
  await verifyAdmin();
  await db.match.delete({ where: { id } });
  revalidatePath("/admin/matches");
  return { success: true };
}

// Metadata (Category)
export async function createCategory(data: { name: string; slug: string; color: string }) {
  await verifyAdmin();
  await db.category.create({ data });
  revalidatePath("/admin/metadata");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await verifyAdmin();
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/metadata");
  return { success: true };
}
