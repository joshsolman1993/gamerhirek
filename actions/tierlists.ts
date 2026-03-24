"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function saveTierList(data: any, title: string) {
  const session = await getSession();
  
  const list = await db.tierList.create({
    data: {
      userId: session?.id || null, // Can be null for guests
      data,
      title,
    },
  });

  return { success: true, id: list.id };
}

export async function getTierList(id: string) {
  return db.tierList.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });
}
