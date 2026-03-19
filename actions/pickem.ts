"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitPredictionAction(matchId: string, predictedWinner: string) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return { error: "Kérjük, lépj be a tippek leadásához!" };
    }

    // Check if match exists and is scheduled
    const match = await db.match.findUnique({
      where: { id: matchId }
    });

    if (!match) {
      return { error: "A mérkőzés nem található." };
    }

    if (match.status !== "SCHEDULED") {
      return { error: "Erre a mérkőzésre már nem lehet tippelni, mert elindult vagy befejeződött." };
    }

    // Upsert prediction (create or update if already predicted)
    // Wait, the unique constraint is [userId, matchId], so we can use upsert or findFirst + update
    const existing = await db.prediction.findUnique({
      where: {
        userId_matchId: {
          userId: session.id,
          matchId: match.id,
        }
      }
    });

    if (existing) {
      await db.prediction.update({
        where: { id: existing.id },
        data: { predictedWinner }
      });
    } else {
      await db.prediction.create({
        data: {
          userId: session.id,
          matchId: match.id,
          predictedWinner
        }
      });
    }

    revalidatePath("/pro-scene/pickem");
    return { success: true };
  } catch (error) {
    console.error("Hiba a jóslat leadásakor:", error);
    return { error: "Szerver hiba történt. Kérjük próbáld később." };
  }
}
