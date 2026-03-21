"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getRiotAccount, getRiotMMR } from "@/lib/riot-api";
import { revalidatePath } from "next/cache";

export async function verifyAndSyncRiotAccount(riotIdFull: string) {
  try {
    const session = await getSession();
    if (!session?.id) return { error: "Nincs bejelentkezve." };

    if (!riotIdFull.includes("#")) {
      return { error: "Helytelen formátum! Használd a Név#TAG formátumot." };
    }

    const [name, tag] = riotIdFull.split("#");
    if (!name || !tag) {
      return { error: "Hiányzik a Név vagy a TAG." };
    }

    // Checking if someone else already linked this Riot ID
    const existingSync = await db.user.findFirst({
      where: { riotId: riotIdFull, id: { not: session.id } }
    });

    if (existingSync) {
      return { error: "Ezt a Riot fiókot már valaki más hozzárendelte a profiljához!" };
    }

    // 1. Fetch Account Data
    const accountData = await getRiotAccount(name, tag);
    if (!accountData) {
      return { error: "Nem található Valorant fiók ezzel a névvel és taggel. (Figyelj a kis/nagybetűkre!)" };
    }

    // 2. Fetch Ranked Data (Assuming EU region as default for local portal)
    const mmrData = await getRiotMMR(accountData.region || "eu", name, tag);
    
    // It's possible the user is Unranked. In this case, mmrData could be empty or null
    const finalRank = mmrData?.currenttierpatched || "Unranked";
    const finalLevel = accountData.account_level || 1;

    // 3. Update User in DB
    await db.user.update({
      where: { id: session.id },
      data: {
        riotId: `${accountData.name}#${accountData.tag}`, // Use exact casing
        riotLevel: finalLevel,
        riotRank: finalRank,
        lastRiotSync: new Date()
      }
    });

    revalidatePath("/profil");
    return { success: true };
  } catch (error) {
    console.error("Hiba a Riot szinkronizáció során:", error);
    return { error: "Kiszolgáló hiba történt a szinkronizáláskor." };
  }
}

export async function unlinkRiotAccount() {
  try {
    const session = await getSession();
    if (!session?.id) return { error: "Nincs bejelentkezve." };

    await db.user.update({
      where: { id: session.id },
      data: {
        riotId: null,
        riotLevel: null,
        riotRank: null,
        lastRiotSync: null
      }
    });

    revalidatePath("/profil");
    revalidatePath("/lfg"); // Revalidate LFG pages where the verified tag might be lost
    return { success: true };
  } catch (error) {
    console.error("Hiba a lecsatoláskor:", error);
    return { error: "Nem sikerült lecsatolni a fiókot." };
  }
}
