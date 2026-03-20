import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCategories } from "@/lib/dal";
import { updateArticle } from "@/actions/articles";
import { DeleteArticleButton } from "@/components/DeleteArticleButton";
import { MarkdownEditor } from "@/components/MarkdownEditor";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditPageProps) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    db.article.findUnique({ where: { id } }),
    getCategories(),
  ]);

  if (!article) notFound();

  const update = updateArticle.bind(null, id);

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/admin/articles" style={{ color: "var(--color-site-muted)", fontSize: "0.875rem" }}>
          ← Vissza
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.75rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Cikk szerkesztése
        </h1>
      </div>

      <form action={update}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem" }}>
          {/* Main fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div
              style={{
                background: "var(--color-site-card)",
                border: "1px solid var(--color-site-border)",
                padding: "1.5rem",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="title"
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-site-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Cím *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="admin-input"
                  defaultValue={article.title}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="excerpt"
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-site-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Kivonat *
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  required
                  rows={3}
                  className="admin-input"
                  defaultValue={article.excerpt}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div>
                <label
                  htmlFor="coverImage"
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-site-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Borítókép URL *
                </label>
                <input
                  id="coverImage"
                  name="coverImage"
                  type="url"
                  required
                  className="admin-input"
                  defaultValue={article.coverImage}
                />
              </div>
            </div>

            <div
              style={{
                background: "var(--color-site-card)",
                border: "1px solid var(--color-site-border)",
                padding: "1.5rem",
              }}
            >
              <label
                htmlFor="content"
                style={{
                  display: "block",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-site-muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Tartalom (Markdown) *
              </label>
              <MarkdownEditor initialValue={article.content} />
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div
              style={{
                background: "var(--color-site-card)",
                border: "1px solid var(--color-site-border)",
                padding: "1.25rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                  paddingBottom: "0.625rem",
                  borderBottom: "1px solid var(--color-site-border)",
                }}
              >
                Beállítások
              </h3>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="categoryId"
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-site-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Kategória *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  className="admin-input"
                  defaultValue={article.categoryId}
                  style={{ cursor: "pointer" }}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={article.featured}
                  style={{ width: "16px", height: "16px", accentColor: "var(--color-val-red)" }}
                />
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.875rem" }}>
                  Kiemelt cikk
                </span>
              </label>
            </div>

            <button type="submit" className="admin-btn-primary">
              Változtatások mentése
            </button>

            {/* Delete — uses Client Component to avoid onClick in Server Component */}
            <DeleteArticleButton id={id} fullWidth />

            <Link href="/admin/articles" className="admin-btn-secondary" style={{ textAlign: "center", display: "block" }}>
              Mégse
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
