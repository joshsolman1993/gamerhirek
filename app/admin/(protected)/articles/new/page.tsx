import { getCategories } from "@/lib/dal";
import { createArticle } from "@/actions/articles";
import Link from "next/link";
import { MarkdownEditor } from "@/components/MarkdownEditor";

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link
          href="/admin/articles"
          style={{ color: "var(--color-site-muted)", fontSize: "0.875rem" }}
        >
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
          Új cikk
        </h1>
      </div>

      <form action={createArticle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "1.5rem",
          }}
        >
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
                  placeholder="Valorant 10.05 Patch Notes — ..."
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
                  placeholder="Rövid összefoglaló, ami megjelenik a kártyákon..."
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
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            {/* Content */}
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
              <MarkdownEditor />
            </div>
          </div>

          {/* Sidebar fields */}
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
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Válassz kategóriát...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="featured"
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "var(--color-val-red)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    Kiemelt cikk
                  </span>
                </label>
                <p style={{ fontSize: "0.75rem", color: "var(--color-site-muted)", marginTop: "0.375rem" }}>
                  A kiemelt cikk jelenik meg a főoldal hero szekciójában
                </p>
              </div>
            </div>

            <button type="submit" className="admin-btn-primary">
              Cikk mentése
            </button>

            <Link
              href="/admin/articles"
              className="admin-btn-secondary"
              style={{ textAlign: "center", display: "block" }}
            >
              Mégse
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
