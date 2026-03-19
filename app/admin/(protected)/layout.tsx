import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 67px)",
        background: "var(--color-site-black)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          background: "var(--color-site-dark)",
          borderRight: "1px solid var(--color-site-border)",
          padding: "1.5rem 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Admin brand */}
        <div
          style={{
            padding: "0 1.25rem 1.25rem",
            borderBottom: "1px solid var(--color-site-border)",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-val-red)",
              marginBottom: "0.25rem",
            }}
          >
            Admin Panel
          </div>
          <div style={{ fontSize: "0.8125rem", color: "var(--color-site-muted)" }}>
            {session.email}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "0 0.75rem", flex: 1 }}>
          {[
            { href: "/admin", label: "Dashboard", icon: "⬡" },
            { href: "/admin/project-board", label: "Fejlesztési Terv", icon: "⚑" },
            { href: "/admin/articles", label: "Cikkek", icon: "≡" },
            { href: "/admin/metadata", label: "Kategóriák", icon: "❖" },
            { href: "/admin/matches", label: "Pick'em Meccsek", icon: "⚔" },
            { href: "/admin/quiz", label: "Napi Kvíz", icon: "❓" },
            { href: "/admin/users", label: "Felhasználók", icon: "👥" },
            { href: "/admin/moderation", label: "Moderáció", icon: "🛡️" },
            { href: "/", label: "← Vissza az oldalra", icon: "" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.625rem 0.75rem",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "0.04em",
                color: "var(--color-site-muted)",
                transition: "all 0.2s ease",
                marginBottom: "0.25rem",
              }}
            >
              <span style={{ color: "var(--color-val-red)", width: "16px" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--color-site-border)" }}>
          <form action={logoutAction} aria-label="Kijelentkezés">
            <button
              type="submit"
              className="admin-btn-secondary"
              style={{ width: "100%", textAlign: "center" }}
            >
              Kijelentkezés
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "2rem", overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
