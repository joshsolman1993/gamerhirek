import Image from "next/image";
import Link from "next/link";
import { getFeaturedArticle, getArticles, getCategories } from "@/lib/dal";
import { ArticleCard } from "@/components/ArticleCard";
import { DailyPoll } from "@/components/DailyPoll";
import { db } from "@/lib/db";
import { formatRelativeDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GamerHírek — Magyar Gaming & Esport Hírek",
  description: "Magyarország vezető Valorant híroldala. Frissítések, profi meccsek, tippek és közösség.",
  openGraph: {
    title: "GamerHírek — Magyar Gaming & Esport Hírek",
    description: "Magyarország vezető Valorant híroldala. Frissítések, profi meccsek, tippek és közösség.",
    url: "https://gamerhirek.hu",
    siteName: "GamerHírek",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "hu_HU",
    type: "website",
  },
};

export default async function HomePage() {
  const [featured, articles, categories, poll] = await Promise.all([
    getFeaturedArticle(),
    getArticles({ limit: 6 }),
    getCategories(),
    db.poll.findFirst({
      where: { active: true },
      include: { options: { orderBy: { votes: "desc" } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const latestArticles = articles.filter((a) => !a.featured).slice(0, 5);

  return (
    <div>
      {/* ─── HERO: Diagonal Cut Featured Article ─── */}
      {featured && (
        <section
          style={{
            position: "relative",
            height: "600px",
            overflow: "hidden",
          }}
        >
          {/* Background image */}
          <Image
            src={featured.coverImage}
            alt={featured.title}
            fill
            priority
            style={{ objectFit: "cover" }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(15,25,35,0.97) 0%, rgba(15,25,35,0.75) 50%, rgba(15,25,35,0.1) 100%)",
            }}
          />

          {/* Diagonal red slice accent */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "var(--color-val-red)",
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "1.25rem",
            }}
          >
            {/* KIEMELT badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  background: "var(--color-val-red)",
                  color: "white",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.6875rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "3px 10px",
                }}
              >
                Kiemelt
              </span>
              <span
                className="cat-badge"
                style={{
                  color: featured.category.color,
                  background: "rgba(15,25,35,0.6)",
                }}
              >
                {featured.category.name}
              </span>
            </div>

            {/* Title */}
            <Link href={`/hirek/${featured.slug}`}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 4vw, 3.25rem)",
                  lineHeight: 1.05,
                  color: "var(--color-site-white)",
                  maxWidth: "700px",
                  margin: 0,
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                }}
              >
                {featured.title}
              </h1>
            </Link>

            {/* Meta */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.875rem",
                  color: "var(--color-site-muted)",
                  letterSpacing: "0.04em",
                }}
              >
                {featured.author.name}
              </span>
              <span style={{ color: "var(--color-val-red)" }}>—</span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.875rem",
                  color: "var(--color-site-muted)",
                }}
              >
                {formatRelativeDate(featured.publishedAt)}
              </span>
            </div>

            {/* CTA */}
            <Link
              href={`/hirek/${featured.slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: "var(--color-val-red)",
                color: "white",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0.75rem 1.5rem",
                width: "fit-content",
                transition: "background 0.2s ease",
              }}
            >
              Olvasd el
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0L6.59 1.41 12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8z" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* ─── CATEGORIES BAR ─── */}
      <section
        style={{
          background: "var(--color-site-dark)",
          borderBottom: "1px solid var(--color-site-border)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            gap: "0",
            overflowX: "auto",
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/kategoria/${cat.slug}`}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.8125rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-site-muted)",
                padding: "1rem 1.25rem",
                borderBottom: "2px solid transparent",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  background: cat.color,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {cat.name}
              <span
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--color-val-red)",
                  fontWeight: 700,
                }}
              >
                {cat._count.articles}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "3rem",
        }}
      >
        {/* Left: Articles grid */}
        <div>
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              className="accent-line"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.375rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Legfrissebb Hírek
            </h2>
            <Link
              href="/hirek"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.8125rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-val-red)",
              }}
            >
              Összes →
            </Link>
          </div>

          {/* Articles grid: 1 large + 2x2 small */}
          <div style={{ display: "grid", gap: "1rem" }}>
            {/* Large card on top */}
            {latestArticles[0] && (
              <ArticleCard article={latestArticles[0]} size="large" />
            )}
            {/* 2x2 grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {latestArticles.slice(1, 5).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar: Patch Notes */}
        <aside>
          <div
            style={{
              position: "sticky",
              top: "80px",
            }}
          >
            {/* Patch Notes widget */}
            <div
              style={{
                background: "var(--color-site-card)",
                border: "1px solid var(--color-site-border)",
                padding: "1.25rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid var(--color-site-border)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  <span style={{ color: "var(--color-val-red)" }}>⬡</span> Patch Notes
                </h3>
                <Link
                  href="/patch-notes"
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-val-red)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Összes →
                </Link>
              </div>

              {/* Patch articles list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {articles
                  .filter((a) => a.category.slug === "patch-notes")
                  .slice(0, 4)
                  .map((article) => (
                    <Link key={article.id} href={`/hirek/${article.slug}`}>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          alignItems: "flex-start",
                          padding: "0.5rem",
                          transition: "background 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "64px",
                            height: "48px",
                            flexShrink: 0,
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <p
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              lineHeight: 1.3,
                              color: "var(--color-site-white)",
                              margin: "0 0 4px 0",
                            }}
                          >
                            {article.title.length > 55
                              ? article.title.slice(0, 55) + "..."
                              : article.title}
                          </p>
                          <p
                            style={{
                              fontSize: "0.6875rem",
                              color: "var(--color-site-muted)",
                              margin: 0,
                            }}
                          >
                            {formatRelativeDate(article.publishedAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Daily Poll widget */}
            {poll && (
              <div style={{ marginTop: "1.5rem" }}>
                <DailyPoll
                  question={poll.question}
                  options={poll.options}
                  pollId={poll.id}
                />
              </div>
            )}

            {/* Valorant info box */}
            <div
              style={{
                marginTop: "1.5rem",
                background: "linear-gradient(135deg, rgba(255,70,85,0.1), rgba(15,25,35,1))",
                border: "1px solid rgba(255,70,85,0.3)",
                padding: "1.25rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-val-red)",
                  marginBottom: "0.5rem",
                }}
              >
                Valorant Jelenlegi Episode
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.75rem",
                  color: "white",
                  lineHeight: 1,
                }}
              >
                Episode 10
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-site-muted)",
                  marginTop: "0.375rem",
                }}
              >
                Act II — aktív
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
