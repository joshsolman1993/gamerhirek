import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { DeleteArticleButton } from "@/components/DeleteArticleButton";

export default async function ArticlesListPage() {
  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      author: { select: { name: true } },
    },
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
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
          Összes cikk{" "}
          <span style={{ color: "var(--color-val-red)", fontWeight: 400, fontSize: "1.25rem" }}>
            ({articles.length})
          </span>
        </h1>
        <Link href="/admin/articles/new" className="admin-btn-primary">
          + Új cikk
        </Link>
      </div>

      <div
        style={{
          background: "var(--color-site-card)",
          border: "1px solid var(--color-site-border)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-val-red)" }}>
              {["Cím", "Kategória", "Szerző", "Kiemelt", "Dátum", "Műveletek"].map((h) => (
                <th
                  key={h}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.6875rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-site-muted)",
                    padding: "0.875rem 1rem",
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr
                key={article.id}
                style={{ borderBottom: "1px solid var(--color-site-border)" }}
              >
                <td
                  style={{
                    padding: "0.875rem 1rem",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    maxWidth: "280px",
                  }}
                >
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {article.title}
                  </div>
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span className="cat-badge" style={{ color: article.category.color, fontSize: "0.6875rem" }}>
                    {article.category.name}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--color-site-muted)" }}>
                  {article.author.name}
                </td>
                <td style={{ padding: "0.875rem 1rem", textAlign: "center" }}>
                  {article.featured ? (
                    <span style={{ color: "var(--color-val-red)", fontWeight: 700 }}>★</span>
                  ) : (
                    <span style={{ color: "var(--color-site-border)" }}>—</span>
                  )}
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "var(--color-site-muted)", whiteSpace: "nowrap" }}>
                  {formatDate(article.publishedAt)}
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="admin-btn-secondary"
                      style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}
                    >
                      Szerkeszt
                    </Link>
                    <DeleteArticleButton id={article.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
