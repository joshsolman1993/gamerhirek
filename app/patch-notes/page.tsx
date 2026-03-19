import { getArticles } from "@/lib/dal";
import { ArticleCard } from "@/components/ArticleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patch Notes | GamerHírek",
  description: "Legfrissebb Valorant frissítések, patch note-ok, ügynök és fegyver egyensúly módosítások magyarul.",
  openGraph: {
    title: "Patch Notes | GamerHírek",
    description: "Legfrissebb Valorant frissítések, patch note-ok, ügynök és fegyver egyensúly módosítások magyarul.",
    type: "website",
  },
};

export default async function PatchNotesPage() {
  const articles = await getArticles({ categorySlug: "patch-notes" });

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-val-red)",
              border: "1px solid var(--color-val-red)",
              padding: "3px 10px",
            }}
          >
            Valorant
          </span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "2.5rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            margin: "0 0 0.5rem",
          }}
        >
          Patch Notes
        </h1>
        <p style={{ color: "var(--color-site-muted)", fontSize: "0.9375rem", maxWidth: "600px" }}>
          Minden friss Valorant frissítés, egyensúlyváltozás és tartalom-kiegészítés — magyarul, tömören, érthetően.
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "2px",
          background: "linear-gradient(90deg, var(--color-val-red), transparent)",
          marginBottom: "2.5rem",
        }}
      />

      {/* Patch list */}
      {articles.length === 0 ? (
        <p style={{ color: "var(--color-site-muted)" }}>Nincsenek patch note-ok.</p>
      ) : (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {articles.map((article, index) => (
            <div key={article.id} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              {/* Version number placeholder */}
              <div
                style={{
                  flexShrink: 0,
                  width: "64px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "var(--color-val-red)",
                    lineHeight: 1,
                  }}
                >
                  {String(articles.length - index).padStart(2, "0")}
                </div>
                <div
                  style={{
                    width: "1px",
                    background: "var(--color-site-border)",
                    height: "100px",
                    margin: "8px auto 0",
                  }}
                />
              </div>
              {/* Card */}
              <div style={{ flex: 1 }}>
                <ArticleCard article={article} size="large" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
