"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { checkAndAwardAchievements } from "./achievements";

export async function getActiveQuiz() {
  const quiz = await db.quiz.findFirst({
    where: { isActive: true },
    include: {
      questions: {
        include: {
          options: {
            select: { id: true, text: true, questionId: true }, // IMPORTANT: Hide `isCorrect` from client
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return quiz;
}

export async function submitQuizAttempt(quizId: string, userAnswers: Record<string, string>) {
  const session = await getSession();
  if (!session) return { error: "Bejelentkezés szükséges!" };

  // Check if user already took this quiz
  const existingAttempt = await db.quizAttempt.findUnique({
    where: { userId_quizId: { userId: session.id, quizId } },
  });

  if (existingAttempt) {
    return { error: "Ezt a kvízt már kitöltötted!" };
  }

  // Fetch true quiz with correct options
  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { include: { options: true } } },
  });

  if (!quiz) return { error: "A kvíz nem található!" };

  // Calculate score
  let score = 0;
  const maxScore = quiz.questions.length;

  for (const q of quiz.questions) {
    const selectedOptionId = userAnswers[q.id];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const correctOption = q.options.find((o: any) => o.isCorrect);
    
    if (correctOption && selectedOptionId === correctOption.id) {
      score += 1;
    }
  }

  // Proportionally award XP based on score (100% correct = full XP)
  // XP formula: max(10, Math.floor((score / maxScore) * xpReward))
  const xpBasis = maxScore > 0 ? (score / maxScore) : 0;
  const xpAwarded = Math.max(10, Math.floor(xpBasis * quiz.xpReward));

  try {
    // Save attempt and award XP using a transaction
    await db.$transaction(async (tx) => {
      await tx.quizAttempt.create({
        data: {
          userId: session.id,
          quizId: quiz.id,
          score,
          maxScore,
          xpAwarded,
        },
      });

      // Update user XP
      const user = await tx.user.findUnique({ where: { id: session.id } });
      if (user) {
        let newXp = user.xp + xpAwarded;
        let newLevel = user.level;

        // Simple level logic (from earlier codebase context): Level = floor(cbrt(XP / 100)) or similar
        // Let's use what we know, or just simple milestone logic: each 100 XP = 1 lvl
        newLevel = Math.floor(newXp / 500) + 1;

        await tx.user.update({
          where: { id: session.id },
          data: { xp: newXp, level: newLevel },
        });
      }
    });

    await checkAndAwardAchievements(session.id); // Gamification Badge check

    revalidatePath("/trivia");
    revalidatePath("/profil");

    return { 
      success: true, 
      score, 
      maxScore, 
      xpAwarded 
    };
  } catch (error) {
    console.error("Trivia submission error:", error);
    return { error: "Váratlan hiba történt az eredmények mentésekor." };
  }
}
