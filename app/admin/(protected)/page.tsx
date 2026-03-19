import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

export default async function AdminDashboard() {
  const [articleCount, categoryCount, articles, usersRecent, categoriesDb] = await Promise.all([
    db.article.count(),
    db.category.count(),
    db.article.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        author: { select: { name: true } },
      },
    }),
    db.user.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 6)),
        },
      },
      select: { createdAt: true },
    }),
    db.category.findMany({
      include: { _count: { select: { articles: true } } },
    }),
  ]);

  // Aggregate user stats
  const userStatsDict: Record<string, number> = {};
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    userStatsDict[d.toISOString().split("T")[0]] = 0;
  }

  usersRecent.forEach((u) => {
    const dStr = u.createdAt.toISOString().split("T")[0];
    if (userStatsDict[dStr] !== undefined) {
      userStatsDict[dStr]++;
    }
  });

  const userStatsArray = Object.keys(userStatsDict).map((k) => ({
    date: k.split("-").slice(1).join("/"),
    count: userStatsDict[k],
  }));

  // Aggregate category stats
  const categoryStatsArray = categoriesDb
    .map((c) => ({
      name: c.name,
      count: c._count.articles,
      color: c.color,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
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
            Dashboard
          </h1>
          <p style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Üdvözöljük a GamerHírek Admin Panelen
          </p>
        </div>
        <Link href="/admin/articles/new" className="admin-btn-primary">
          + Új cikk
        </Link>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {[
          { label: "Összes cikk", value: articleCount, color: "var(--color-val-red)" },
          { label: "Kategóriák", value: categoryCount, color: "var(--color-esport-teal)" },
          { label: "Kiemelt cikkek", value: articles.filter((a) => a.featured).length, color: "var(--color-patch-gold)" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--color-site-card)",
              border: "1px solid var(--color-site-border)",
              padding: "1.25rem 1.5rem",
              borderTop: `3px solid ${stat.color}`,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "2.25rem",
                color: stat.color,
                lineHeight: 1,
                marginBottom: "0.375rem",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-site-muted)",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <AnalyticsDashboard userStats={userStatsArray} categoryStats={categoryStatsArray} />

      {/* Articles table */}
      <div
        style={{
          background: "var(--color-site-card)",
          border: "1px solid var(--color-site-border)",
        }}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--color-site-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Legutóbbi cikkek
          </h2>
          <Link
            href="/admin/articles"
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-val-red)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Összes →
          </Link>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-site-border)" }}>
              {["Cím", "Kategória", "Szerző", "Dátum", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.6875rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-site-muted)",
                    padding: "0.625rem 1rem",
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
                    fontSize: "0.9rem",
                    maxWidth: "320px",
                  }}
                >
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "320px" }}>
                    {article.featured && (
                      <span
                        style={{
                          fontSize: "0.625rem",
                          background: "var(--color-val-red)",
                          color: "white",
                          padding: "1px 5px",
                          marginRight: "6px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                        }}
                      >
                        KIEMELT
                      </span>
                    )}
                    {article.title}
                  </div>
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span
                    className="cat-badge"
                    style={{ color: article.category.color, fontSize: "0.6875rem" }}
                  >
                    {article.category.name}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--color-site-muted)" }}>
                  {article.author.name}
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
                    <Link
                      href={`/hirek/${article.slug}`}
                      className="admin-btn-secondary"
                      target="_blank"
                      style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}
                    >
                      Megtekint
                    </Link>
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
