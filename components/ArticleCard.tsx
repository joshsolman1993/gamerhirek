import Link from "next/link";
import Image from "next/image";
import { formatRelativeDate } from "@/lib/utils";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    publishedAt: Date;
    category: { name: string; slug: string; color: string };
    author: { name: string };
  };
  size?: "normal" | "large";
}

export function ArticleCard({ article, size = "normal" }: ArticleCardProps) {
  const isLarge = size === "large";

  return (
    <Link href={`/hirek/${article.slug}`}>
      <article
        className="article-card"
        style={{
          background: "var(--color-site-card)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          cursor: "pointer",
        }}
      >
        {/* Image */}
        <div
          className="glitch-img"
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: isLarge ? "50%" : "60%",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          />
          {/* Category overlay */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              zIndex: 2,
            }}
          >
            <span
              className="cat-badge"
              style={{ color: article.category.color, background: "rgba(15, 25, 35, 0.85)" }}
            >
              {article.category.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            padding: isLarge ? "1.5rem" : "1.125rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
            flexGrow: 1,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: isLarge ? "1.375rem" : "1.0625rem",
              lineHeight: 1.2,
              color: "var(--color-site-white)",
              margin: 0,
            }}
          >
            {article.title}
          </h3>

          {isLarge && (
            <p
              style={{
                fontSize: "0.9rem",
                color: "rgba(236, 232, 225, 0.7)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {article.excerpt}
            </p>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginTop: "auto",
              paddingTop: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--color-site-muted)" }}>
              {article.author.name}
            </span>
            <span style={{ color: "var(--color-val-red)", fontSize: "0.75rem" }}>•</span>
            <span style={{ fontSize: "0.75rem", color: "var(--color-site-muted)" }}>
              {formatRelativeDate(article.publishedAt)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
