import { ValorantStatsWidget } from "@/components/ValorantStatsWidget";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Valorant Stats — GamerHírek",
  description: "Nézd meg a Valorant rankedet, K/D arányodat, win rate-edet és legjobb ágenseidet. Írd be a neved és a taget!",
};

export default function StatsPage() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>

      {/* Page header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <div style={{
            width: "4px",
            height: "2rem",
            background: "var(--color-val-red)",
          }} />
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-val-red)",
          }}>
            Tracker
          </span>
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "clamp(2rem, 4vw, 3rem)",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          lineHeight: 1.05,
          margin: 0,
          marginBottom: "0.75rem",
        }}>
          Valorant{" "}
          <span style={{ color: "var(--color-val-red)" }}>Stats</span>
          {" "}Tracker
        </h1>
        <p style={{
          color: "var(--color-site-muted)",
          fontSize: "1rem",
          maxWidth: "560px",
        }}>
          Nézd meg az aktuális rankedet, K/D arányodat, win rate-et és legjobb ágenseidet az elmúlt 10 competitive meccsből.
        </p>
        <div style={{ marginTop: "1.5rem" }}>
          <Link href="/stats/history" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(0, 196, 180, 0.1)", border: "1px solid var(--color-esport-teal)", color: "var(--color-esport-teal)", padding: "0.75rem 1.5rem", borderRadius: "4px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", textDecoration: "none", transition: "all 0.2s ease" }}>
            Mélyebb Elemzés: Match History &rarr;
          </Link>
        </div>
      </div>

      {/* Widget */}
      <ValorantStatsWidget />

      {/* ─── Info section ─── */}
      <div style={{
        marginTop: "3rem",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
      }}
      className="stats-info-grid">
        {[
          {
            icon: "🎯",
            title: "Live adatok",
            desc: "Az adatok közvetlenül a Riot szervereiről érkeznek, 2 perces cache-sel.",
          },
          {
            icon: "🔒",
            title: "Privát profil",
            desc: "Nem tárolunk semilyen játékos adatot — minden keresés valós időben történik.",
          },
          {
            icon: "📊",
            title: "10 meccs alapján",
            desc: "A statisztikák az utolsó 10 competitive mérkőzés alapján kerülnek kiszámításra.",
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              background: "var(--color-site-card)",
              border: "1px solid var(--color-site-border)",
              padding: "1.25rem",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.625rem" }}>{item.icon}</div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.04em",
              marginBottom: "0.375rem",
            }}>
              {item.title}
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--color-site-muted)", lineHeight: 1.5 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
