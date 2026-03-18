import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ articles: [] });
  }

  const articles = await db.article.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
      ],
    },
    include: {
      category: { select: { name: true, slug: true, color: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 8,
  });

  return NextResponse.json({ articles });
}
