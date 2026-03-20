import { db } from "@/lib/db";
// removed formatDate
import { CreateCategoryForm } from "./CreateCategoryForm";
import { DeleteCategoryButton } from "./DeleteCategoryButton";

export const dynamic = "force-dynamic";

export default async function AdminMetadataPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.75rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "0.25rem",
            }}
          >
            Kategóriák és Lényegi Metaadatok
          </h1>
          <p style={{ color: "var(--color-site-muted)" }}>
            Kezeld a Hír kategóriákat és a hozzájuk kapcsolódó színkódokat az egységes UI-ért!
          </p>
        </div>
        <CreateCategoryForm />
      </div>

      <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-site-border)" }}>
              {["Kategória", "Színkód", "Cikkek", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-site-muted)",
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "1rem", color: "var(--color-site-white)", fontWeight: 700 }}>
                  <span style={{ borderLeft: `4px solid ${cat.color}`, paddingLeft: "0.5rem" }}>
                    {cat.name}
                  </span>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-site-muted)", marginTop: "0.25rem", paddingLeft: "0.5rem" }}>/{cat.slug}</div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: cat.color }} />
                    <span style={{ fontSize: "0.85rem", color: "var(--color-site-muted)", fontFamily: "monospace" }}>{cat.color}</span>
                  </div>
                </td>
                <td style={{ padding: "1rem", color: "var(--color-patch-gold)", fontWeight: 700 }}>
                  {cat._count.articles} db
                </td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <DeleteCategoryButton id={cat.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
