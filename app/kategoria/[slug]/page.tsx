import { notFound } from "next/navigation";
import { getArticles, getCategories } from "@/lib/dal";
import { ArticleCard } from "@/components/ArticleCard";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return {};
  return { title: cat.name };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [categories, articles] = await Promise.all([
    getCategories(),
    getArticles({ categorySlug: slug }),
  ]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      {/* Header */}
      <div
        style={{
          marginBottom: "2.5rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid var(--color-site-border)",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "48px",
            background: category.color,
            flexShrink: 0,
          }}
        />
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "2.25rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {category.name}
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-site-muted)", margin: "4px 0 0" }}>
            {category._count.articles} cikk ebben a kategóriában
          </p>
        </div>
      </div>

      {/* Articles grid */}
      {articles.length === 0 ? (
        <p style={{ color: "var(--color-site-muted)" }}>
          Még nincsenek cikkek ebben a kategóriában.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
