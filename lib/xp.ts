import { db } from "@/lib/db";

// Thresholds for each level (level -> required max xp for next)
export const LEVEL_THRESHOLDS = [
  0,       // Level 1: 0-99
  100,     // Level 2: 100-249
  250,     // Level 3: 250-499
  500,     // Level 4: 500-999
  1000,    // Level 5: 1000-1999
  2000,    // Level 6: 2000-4999
  5000,    // Level 7: 5000-9999
  10000,   // Level 8: 10000+
];

export function calculateLevel(xp: number): { currentLevel: number; progress: number; nextThreshold: number | null } {
  let currentLevel = 1;
  let nextThreshold: number | null = null;
  let progress = 0;

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      currentLevel = i + 1;
      if (i < LEVEL_THRESHOLDS.length - 1) {
        nextThreshold = LEVEL_THRESHOLDS[i + 1];
        const prevThreshold = LEVEL_THRESHOLDS[i];
        const range = nextThreshold - prevThreshold;
        const currentProgressXp = xp - prevThreshold;
        progress = Math.min(100, Math.round((currentProgressXp / range) * 100));
      } else {
        progress = 100;
      }
      break;
    }
  }

  return { currentLevel, progress, nextThreshold };
}

export async function addXP(userId: string, amount: number) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const newXp = user.xp + amount;
  const { currentLevel } = calculateLevel(newXp);

  return db.user.update({
    where: { id: userId },
    data: { 
      xp: newXp,
      level: currentLevel, 
    },
  });
}

export async function checkAchievements(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { achievements: true },
  });
  if (!user) return;

  const earnedIds = user.achievements.map((ua) => ua.achievementId);
  const allAchievements = await db.achievement.findMany();
  
  // Custom logic checks for achievements (e.g. check standard database counts)
  // E.g., if user has 5 comments, award "Csevegő" (Chatterbox) achievement, etc.

  // NOTE: Stub logic. Real application would trigger on specific events (commenting, reaching level 5, etc.)
  for (const ach of allAchievements) {
    if (!earnedIds.includes(ach.id)) {
      // Stub generic unlock for specific conditions
      if (ach.name === "Veteran" && user.level >= 5) {
        await db.userAchievement.create({
          data: { userId, achievementId: ach.id },
        });
        await addXP(userId, ach.xpReward);
      }
    }
  }
}
