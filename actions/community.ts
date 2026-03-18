"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CommentSchema = z.object({
  content: z.string().min(3, "Legalább 3 karakter szükséges").max(1000, "Maximum 1000 karakter"),
  authorName: z.string().min(2, "Legalább 2 karakter szükséges").max(50),
  authorEmail: z.string().email().optional().or(z.literal("")),
  articleId: z.string().min(1),
  // Honeypot spam protection
  website: z.string().max(0, "Bot detected"),
});

export async function addComment(formData: FormData) {
  const raw = {
    content: formData.get("content") as string,
    authorName: formData.get("authorName") as string,
    authorEmail: (formData.get("authorEmail") as string) || undefined,
    articleId: formData.get("articleId") as string,
    website: (formData.get("website") as string) ?? "",
  };

  const parsed = CommentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  await db.comment.create({
    data: {
      content: parsed.data.content,
      authorName: parsed.data.authorName,
      authorEmail: parsed.data.authorEmail || null,
      articleId: parsed.data.articleId,
    },
  });

  revalidatePath("/hirek/[slug]", "page");
  return { success: true };
}

export async function votePoll(optionId: string) {
  await db.pollOption.update({
    where: { id: optionId },
    data: { votes: { increment: 1 } },
  });
  revalidatePath("/");
  return { success: true };
}
