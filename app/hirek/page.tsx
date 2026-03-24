import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { hu } from "date-fns/locale";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Összes Hír | GamerHírek",
  description: "Böngéssz az összes korábbi Valorant, E-sport és közösségi cikkünk között a hírarchívumban.",
};

export default async function NewsArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const pageParam = resolvedParams.page;
  const page = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;
  const limit = 12;
  const skip = (Math.max(1, page) - 1) * limit;

  const [articles, totalCount] = await Promise.all([
    db.article.findMany({
      where: { publishedAt: { lte: new Date() } },
      include: {
        category: true,
        author: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    db.article.count({
      where: { publishedAt: { lte: new Date() } },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <header style={{ marginBottom: "3rem", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "2.5rem", textTransform: "uppercase", letterSpacing: "0.02em", margin: "0 0 0.5rem 0" }}>
          Hírarchívum
        </h1>
        <p style={{ color: "var(--color-site-muted)", margin: 0 }}>
          Böngéssz az összes eddigi cikk és beszámoló között.
        </p>
      </header>

      {articles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--color-site-muted)" }}>
          Nincsenek publikált cikkek jelenleg.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
          {articles.map((article) => (
            <Link key={article.id} href={`/hirek/${article.slug}`} style={{ textDecoration: "none" }}>
              <article style={{ display: "flex", flexDirection: "column", gap: "1rem", cursor: "pointer" }} className="hover:opacity-80 transition-opacity">
                <div style={{ width: "100%", aspectRatio: "16/9", position: "relative", overflow: "hidden", borderRadius: "8px" }}>
                  <Image src={article.coverImage} alt={article.title} fill style={{ objectFit: "cover" }} />
                  {article.category && (
                    <div style={{ position: "absolute", top: "1rem", left: "1rem", background: article.category.color, color: "#fff", padding: "0.25rem 0.75rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-display)" }}>
                      {article.category.name}
                    </div>
                  )}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-site-white)", marginTop: 0, marginBottom: "0.5rem", lineHeight: 1.3 }}>
                    {article.title}
                  </h3>
                  <div style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span>{article.author.name}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: hu })}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ marginTop: "4rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          {page > 1 && (
            <Link href={`/hirek?page=${page - 1}`} style={{ padding: "0.5rem 1rem", border: "1px solid var(--color-site-border)", borderRadius: "4px", color: "var(--color-site-white)", textDecoration: "none", fontWeight: 700 }}>
              Előző
            </Link>
          )}
          <span style={{ padding: "0.5rem 1rem", background: "rgba(255,255,255,0.05)", borderRadius: "4px", color: "var(--color-site-muted)" }}>
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/hirek?page=${page + 1}`} style={{ padding: "0.5rem 1rem", border: "1px solid var(--color-site-border)", borderRadius: "4px", color: "var(--color-site-white)", textDecoration: "none", fontWeight: 700 }}>
              Következő
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
