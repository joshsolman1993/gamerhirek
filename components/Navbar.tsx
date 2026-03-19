import Link from "next/link";
import { SearchOverlay } from "@/components/SearchOverlay";

export function Navbar() {
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
        {/* Logo */}
        <Link href="/" style={{ flexShrink: 0, textDecoration: "none" }}>
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

        {/* Nav links */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: 1 }}>
          {[
            { href: "/kategoria/esport", label: "Esport" },
            { href: "/kategoria/hirek", label: "Hírek" },
            { href: "/patch-notes", label: "Patch Notes" },
            { href: "/kategoria/tippek-utmutatek", label: "Tipp & Útmutató" },
            { href: "/tier-list", label: "📊 Tier List" },
            { href: "/terkep-guides", label: "🗺️ Térképek", highlight: true },
            { href: "/napirend", label: "🗓️ Napirend", highlight: true },
            { href: "/pro-scene", label: "🏆 Pro Scene", highlight: true },
            { href: "/stats", label: "📊 Stats", highlight: true },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: (item as { highlight?: boolean }).highlight ? "var(--color-esport-teal)" : "var(--color-site-muted)",
                padding: "0.375rem 0.75rem",
                transition: "color 0.2s ease",
                whiteSpace: "nowrap",
              }}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
          <SearchOverlay />
          <Link
            href="/admin"
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
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
