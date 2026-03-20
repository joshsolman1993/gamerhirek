import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/dal";
import { formatDate } from "@/lib/utils";
import { ArticleCard } from "@/components/ArticleCard";
import { CommentSection } from "@/components/CommentSection";
import { NewsletterForm } from "@/components/NewsletterForm";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article, related] = await Promise.all([
    getArticleBySlug(slug),
    getArticles({ limit: 4 }),
  ]);

  if (!article) notFound();

  const session = await getSession();

  const commentsData = await db.comment.findMany({
    where: { articleId: article.id, approved: true },
    orderBy: { createdAt: "desc" },
    select: { 
      id: true, 
      authorName: true, 
      content: true, 
      createdAt: true, 
      userId: true,
      user: { select: { avatarUrl: true } },
      _count: { select: { upvotes: true } },
      upvotes: session?.id ? { where: { userId: session.id } } : false,
    },
  });

  const comments = commentsData.map(c => ({
    id: c.id,
    authorName: c.authorName,
    content: c.content,
    createdAt: c.createdAt,
    userId: c.userId,
    userAvatar: c.user?.avatarUrl,
    upvotesC: c._count.upvotes,
    isUpvoted: c.upvotes && c.upvotes.length > 0
  }));


  const relatedArticles = related
    .filter((a) => a.id !== article.id && a.category.id === article.category.id)
    .slice(0, 3);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "3rem" }}>
        {/* Article content */}
        <article>
          {/* Breadcrumb */}
          <nav style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Link
              href="/"
              style={{ fontSize: "0.8125rem", color: "var(--color-site-muted)" }}
            >
              Főoldal
            </Link>
            <span style={{ color: "var(--color-site-muted)", fontSize: "0.8125rem" }}>/</span>
            <Link
              href={`/kategoria/${article.category.slug}`}
              style={{ fontSize: "0.8125rem", color: "var(--color-val-red)" }}
            >
              {article.category.name}
            </Link>
          </nav>

          {/* Category + tags */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span
              className="cat-badge"
              style={{ color: article.category.color }}
            >
              {article.category.name}
            </span>
            {article.tags.map((t) => (
              <span
                key={t.tagId}
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-site-muted)",
                  border: "1px solid var(--color-site-border)",
                  padding: "2px 8px",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.05em",
                }}
              >
                #{t.tag.name}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              lineHeight: 1.1,
              color: "var(--color-site-white)",
              marginBottom: "1.25rem",
            }}
          >
            {article.title}
          </h1>

          {/* Meta */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid var(--color-site-border)",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "var(--color-val-red)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "white",
              }}
            >
              {article.author.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.875rem" }}>
                {article.author.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-site-muted)" }}>
                {formatDate(article.publishedAt)}
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "50%",
              marginBottom: "2rem",
              overflow: "hidden",
            }}
          >
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Content — simple markdown-like rendering */}
          <div className="prose-game">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                /* eslint-disable @typescript-eslint/no-unused-vars */
                img: ({ node, ...props }) => (
                  <div style={{ position: "relative", width: "100%", margin: "2.5rem 0", borderRadius: "12px", overflow: "hidden" }}>
                    {/* fallback image styling */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      {...props}
                      alt={props.alt || "Cikk kép"}
                      style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
                    />
                  </div>
                ),
                h2: ({ node, ...props }) => <h2 style={{ fontSize: "2rem", marginTop: "2.5rem", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "0.5rem" }} {...props} />,
                h3: ({ node, ...props }) => <h3 style={{ fontSize: "1.5rem", marginTop: "2rem", color: "var(--color-site-white)" }} {...props} />,
                a: ({ node, ...props }) => <a style={{ color: "var(--color-val-red)", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="prose-game" {...props} />,
                code: ({ node, ...props }) => <code style={{ background: "var(--color-site-card)", padding: "0.2rem 0.4rem", borderRadius: "4px", fontSize: "0.875em", color: "var(--color-val-red)" }} {...props} />,
                strong: ({ node, ...props }) => <strong style={{ color: "var(--color-site-white)", fontWeight: 700 }} {...props} />
                /* eslint-enable @typescript-eslint/no-unused-vars */
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Newsletter Banner */}
          <div style={{ margin: "4rem 0" }}>
            <NewsletterForm />
          </div>

          {/* Comment section */}
          <CommentSection
            articleId={article.id}
            initialComments={comments}
          />
        </article>

        {/* Sidebar */}
        <aside style={{ position: "relative" }}>
          <div style={{ position: "sticky", top: "80px" }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid var(--color-site-border)",
              }}
            >
              <span style={{ color: "var(--color-val-red)" }}>▶</span> Kapcsolódó cikkek
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {relatedArticles.length > 0
                ? relatedArticles.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))
                : (
                  <p style={{ fontSize: "0.875rem", color: "var(--color-site-muted)" }}>
                    Nincsenek kapcsolódó cikkek.
                  </p>
                )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
