"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createLFGPost(formData: FormData) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return { error: "Kérjük, jelentkezz be a hirdetés feladásához!" };
    }

    const content = formData.get("content") as string;
    const rank = formData.get("rank") as string;
    const roles = formData.get("roles") as string;
    const server = formData.get("server") as string;
    const mic = formData.get("mic") === "on";

    if (!content || content.length < 5 || content.length > 300) {
      return { error: "A leírásnak 5 és 300 karakter között kell lennie." };
    }

    await db.lFGPost.create({
      data: {
        userId: session.id,
        content,
        rank,
        roles,
        server,
        mic
      }
    });

    revalidatePath("/lfg");
    return { success: true };
  } catch (error) {
    console.error("Hiba LFG posztolásakor:", error);
    return { error: "Szerver hiba történt." };
  }
}
