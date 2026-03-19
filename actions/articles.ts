"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { generateSlug } from "@/lib/utils";

const ArticleSchema = z.object({
  title: z.string().min(5, "A cím legalább 5 karakter legyen"),
  excerpt: z.string().min(10, "A kivonat legalább 10 karakter legyen"),
  content: z.string().min(20, "A tartalom legalább 20 karakter legyen"),
  coverImage: z.string().url("Érvényes URL szükséges"),
  categoryId: z.string().min(1, "Válassz kategóriát"),
  featured: z.boolean().optional(),
});

export async function createArticle(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const raw = {
    title: formData.get("title") as string,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    coverImage: formData.get("coverImage") as string,
    categoryId: formData.get("categoryId") as string,
    featured: formData.get("featured") === "on",
  };

  const parsed = ArticleSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  const slug = generateSlug(raw.title);

  const newArticle = await db.article.create({
    data: {
      ...parsed.data,
      featured: parsed.data.featured ?? false,
      slug,
      authorId: session.id,
    },
  });

  // Discord Webhook Integration
  if (process.env.DISCORD_WEBHOOK_URL) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
      
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "🚀 **Új cikk jelent meg a GamerHíreken!**",
          embeds: [
            {
              title: newArticle.title,
              description: newArticle.excerpt,
              url: `${appUrl}/hirek/${newArticle.slug}`,
              color: 16729685, // #FF4655 (Var(--color-val-red))
              image: {
                url: newArticle.coverImage,
              },
              footer: {
                text: "GamerHírek.hu - A Magyar Gamerek Otthona",
              },
              timestamp: new Date().toISOString()
            }
          ]
        })
      });
    } catch (err) {
      console.error("Failed to send Discord webhook:", err);
      // We don't fail the article creation if webhook fails
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateArticle(id: string, formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const raw = {
    title: formData.get("title") as string,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    coverImage: formData.get("coverImage") as string,
    categoryId: formData.get("categoryId") as string,
    featured: formData.get("featured") === "on",
  };

  const parsed = ArticleSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  await db.article.update({
    where: { id },
    data: {
      ...parsed.data,
      featured: parsed.data.featured ?? false,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteArticle(id: string) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await db.article.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
