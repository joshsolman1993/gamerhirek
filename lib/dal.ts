import { db } from "@/lib/db";

export async function getArticles({
  categorySlug,
  featured,
  limit,
  search,
}: {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
} = {}) {
  return db.article.findMany({
    where: {
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(featured !== undefined ? { featured } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { excerpt: { contains: search } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      author: { select: { name: true, email: true } },
      tags: { include: { tag: true } },
    },
    orderBy: { publishedAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
}

export async function getArticleBySlug(slug: string) {
  return db.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { name: true, email: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function getCategories() {
  return db.category.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getFeaturedArticle() {
  return db.article.findFirst({
    where: { featured: true },
    include: {
      category: true,
      author: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
  });
}
