"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const MAX_DAILY_GC = 100;

export async function earnGamerCoin(amount: number) {
  try {
    const session = await getSession();
    if (!session?.id) return { error: "Nincs bejelentkezve." };

    const user = await db.user.findUnique({ where: { id: session.id } });
    if (!user) return { error: "Felhasználó nem található." };

    const now = new Date();
    const lastDate = user.lastGCDate;
    
    // Check if a new day has started
    let isNewDay = true;
    if (lastDate) {
      if (
        lastDate.getDate() === now.getDate() &&
        lastDate.getMonth() === now.getMonth() &&
        lastDate.getFullYear() === now.getFullYear()
      ) {
        isNewDay = false;
      }
    }

    let newDailyTotal = isNewDay ? amount : user.dailyGCEarned + amount;
    
    // Cap at MAX_DAILY_GC
    if (!isNewDay && user.dailyGCEarned >= MAX_DAILY_GC) {
      return { warning: "Elérted a napi GamerCoin limitet!" };
    }
    
    const actualEarned = Math.min(amount, MAX_DAILY_GC - (isNewDay ? 0 : user.dailyGCEarned));
    newDailyTotal = isNewDay ? actualEarned : user.dailyGCEarned + actualEarned;

    await db.user.update({
      where: { id: session.id },
      data: {
        gamerCoin: { increment: actualEarned },
        dailyGCEarned: newDailyTotal,
        lastGCDate: now,
      }
    });

    return { success: true, earned: actualEarned };
  } catch (error) {
    console.error("Hiba GamerCoin jóváírásakor:", error);
    return { error: "Szerver hiba történt." };
  }
}

export async function buyShopItem(shopItemId: string) {
  try {
    const session = await getSession();
    if (!session?.id) return { error: "Lépj be a vásárláshoz!" };

    return await db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: session.id } });
      if (!user) throw new Error("Felhasználó nem található.");

      const item = await tx.shopItem.findUnique({ where: { id: shopItemId } });
      if (!item) throw new Error("A tárgy nem található.");
      if (!item.isActive) throw new Error("Ez a tárgy jelenleg nem elérhető.");

      if (user.gamerCoin < item.price) {
        throw new Error("Nincs elég GamerCoin-od.");
      }

      // Check if already purchased
      const existingPurchase = await tx.userPurchase.findUnique({
        where: {
          userId_shopItemId: {
            userId: session.id,
            shopItemId: item.id
          } // Note: This requires the @@unique compound index in the schema
        }
      });

      if (existingPurchase) {
        throw new Error("Ezt a tárgyat már megvásároltad.");
      }

      // Deduct coins and record purchase
      await tx.user.update({
        where: { id: user.id },
        data: { gamerCoin: { decrement: item.price } }
      });

      await tx.userPurchase.create({
        data: {
          userId: user.id,
          shopItemId: item.id
        }
      });

      return { success: true };
    });
  } catch (error: any) {
    if (error.message) {
      return { error: error.message };
    }
    return { error: "Sikertelen vásárlás. Próbáld újra." };
  }
}

export async function setFavoriteTeam(teamName: string) {
  try {
    const session = await getSession();
    if (!session?.id) return { error: "Nincs bejelentkezve." };

    const user = await db.user.findUnique({ where: { id: session.id } });
    if (!user) return { error: "Felhasználó nem található." };

    const COOLDOWN_HOURS = 3;
    const now = new Date();

    if (user.favoriteTeamChangedAt) {
      const diffHours = (now.getTime() - user.favoriteTeamChangedAt.getTime()) / (1000 * 60 * 60);
      if (diffHours < COOLDOWN_HOURS) {
        const remainingMinutes = Math.ceil((COOLDOWN_HOURS - diffHours) * 60);
        return { error: `Nem változtathatsz csapatot még ${remainingMinutes} percig.` };
      }
    }

    await db.user.update({
      where: { id: session.id },
      data: {
        favoriteTeam: teamName,
        favoriteTeamChangedAt: now
      }
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Hiba csapat mentésekor:", error);
    return { error: "Szerver hiba történt." };
  }
}
