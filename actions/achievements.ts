"use server";

import { db } from "@/lib/db";

// Definitions of the automated badges
const BADGES = [
  {
    id: "badge_first_prediction",
    name: "Fogadások Kezdete",
    description: "Leadogattál egy fogadást egy esport meccsre.",
    iconUrl: "🔮",
    xpReward: 50,
  },
  {
    id: "badge_level_10",
    name: "Tapasztalt Ügynök",
    description: "Elérted a 10. szintet.",
    iconUrl: "⭐",
    xpReward: 100,
  },
  {
    id: "badge_quiz_master",
    name: "Kvíz Mester",
    description: "Sikeresen kitöltöttél 5 Napi Kvízt.",
    iconUrl: "🧠",
    xpReward: 150,
  },
  {
    id: "badge_social_butterfly",
    name: "Kocsma Töltelék",
    description: "Bekapcsolódtál a Globál Kocsmába és írtál 10 üzenetet.",
    iconUrl: "🍻",
    xpReward: 100,
  },
];

export async function checkAndAwardAchievements(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        predictions: true,
        quizAttempts: true,
        globalChats: true,
        achievements: true,
      },
    });

    if (!user) return;

    const currentBadges = user.achievements.map((a) => a.achievementId);
    let newlyAwarded = 0;
    let earnedXp = 0;

    // Seed/Upsert badges locally in logic (to ensure they exist in DB)
    for (const badge of BADGES) {
      await db.achievement.upsert({
        where: { id: badge.id },
        update: {},
        create: {
          id: badge.id,
          name: badge.name,
          description: badge.description,
          iconUrl: badge.iconUrl,
          xpReward: badge.xpReward,
        },
      });
    }

    // Evaluate FIRST_PREDICTION
    if (!currentBadges.includes("badge_first_prediction") && user.predictions.length >= 1) {
      await awardBadge(user.id, "badge_first_prediction");
      newlyAwarded++;
      earnedXp += BADGES.find((b) => b.id === "badge_first_prediction")!.xpReward;
    }

    // Evaluate LEVEL_10
    if (!currentBadges.includes("badge_level_10") && user.level >= 10) {
      await awardBadge(user.id, "badge_level_10");
      newlyAwarded++;
      earnedXp += BADGES.find((b) => b.id === "badge_level_10")!.xpReward;
    }

    // Evaluate QUIZ_MASTER
    if (!currentListHas(currentBadges, "badge_quiz_master") && user.quizAttempts.length >= 5) {
      await awardBadge(user.id, "badge_quiz_master");
      newlyAwarded++;
      earnedXp += BADGES.find((b) => b.id === "badge_quiz_master")!.xpReward;
    }

    // Evaluate SOCIAL_BUTTERFLY
    if (!currentListHas(currentBadges, "badge_social_butterfly") && user.globalChats.length >= 10) {
      await awardBadge(user.id, "badge_social_butterfly");
      newlyAwarded++;
      earnedXp += BADGES.find((b) => b.id === "badge_social_butterfly")!.xpReward;
    }

    // Update user stats if new xp was earned
    if (newlyAwarded > 0) {
       const newXp = user.xp + earnedXp;
       const newLevel = Math.max(user.level, Math.floor(newXp / 500) + 1);
       
       await db.user.update({
         where: { id: userId },
         data: { xp: newXp, level: newLevel }
       });
    }

  } catch (err) {
    console.error("Failed to check achievements:", err);
  }
}

function currentListHas(list: string[], badgeId: string) {
  return list.includes(badgeId);
}

async function awardBadge(userId: string, achievementId: string) {
  await db.userAchievement.create({
    data: {
      userId,
      achievementId,
    },
  });
}
