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
    return { error: parsed.error.errors[0].message };
  }

  const slug = generateSlug(raw.title);

  await db.article.create({
    data: {
      ...parsed.data,
      featured: parsed.data.featured ?? false,
      slug,
      authorId: session.id,
    },
  });

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
    return { error: parsed.error.errors[0].message };
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
