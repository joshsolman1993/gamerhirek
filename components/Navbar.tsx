import Link from "next/link";
import { SearchOverlay } from "@/components/SearchOverlay";
import { NotificationBell } from "@/components/NotificationBell";
import { getSession } from "@/lib/auth";

export async function Navbar() {
  const session = await getSession();

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(15,25,35,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--color-site-border)",
    }}>
      <nav style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 1.5rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        gap: "2rem",
      }}>
        {/* Logo - Csak mobilon látszik */}
        <Link href="/" style={{ flexShrink: 0, textDecoration: "none" }} className="nav-logo-mobile">
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.375rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}>
            <div style={{
              width: "28px", height: "28px",
              background: "var(--color-val-red)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.875rem", fontWeight: 900, color: "white",
              clipPath: "polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)",
            }}>G</div>
            Gamer<span style={{ color: "var(--color-val-red)" }}>Hírek</span>
          </div>
        </Link>

        {/* Space filler where links used to be */}
        <div style={{ flex: 1 }} />

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
          <SearchOverlay />
          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <NotificationBell />
              {session.role === "ADMIN" && (
                 <Link
                  href="/admin"
                  className="nav-link"
                  title="Admin Felület"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-site-muted)",
                    padding: "0.375rem 0.5rem",
                  }}
                 >
                   Admin
                 </Link>
              )}
              <Link
                href="/profil"
                className="nav-link"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-site-bg)",
                  background: "var(--color-esport-teal)",
                  border: "1px solid var(--color-esport-teal)",
                  padding: "0.375rem 0.875rem",
                  transition: "all 0.2s ease",
                  borderRadius: "4px"
                }}
              >
                {session.name.split(" ")[0]}
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="nav-link"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-val-red)",
                border: "1px solid var(--color-val-red)",
                padding: "0.375rem 0.875rem",
                transition: "all 0.2s ease",
              }}
            >
              Belépés
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
