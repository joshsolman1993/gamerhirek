import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { CreateMatchForm } from "./CreateMatchForm";
import { MatchStatusActions } from "./MatchStatusActions";

export const dynamic = "force-dynamic";

export default async function AdminMatchesPage() {
  const matches = await db.match.findMany({
    orderBy: { startTime: "desc" },
    include: { _count: { select: { predictions: true } } },
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
            Pick&apos;em Meccsek
          </h1>
          <p style={{ color: "var(--color-site-muted)" }}>
            Hozz létre új profi meccseket és zárd le a meglévőket a nyertes megadásával.
          </p>
        </div>
        <CreateMatchForm />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
        {matches.map((match) => (
          <div key={match.id} style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "4px", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.5rem" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--color-site-white)", textTransform: "uppercase" }}>
                  {match.teamA} <span style={{ color: "var(--color-val-red)" }}>vs</span> {match.teamB}
                </h3>
                <span style={{ 
                  background: match.status === "COMPLETED" ? "var(--color-esport-teal)" : "var(--color-val-red)", 
                  color: "var(--color-site-bg)", 
                  padding: "0.1rem 0.5rem", 
                  borderRadius: "4px", 
                  fontSize: "0.75rem", 
                  fontWeight: 700 
                }}>
                  {match.status}
                </span>
                <span style={{ color: "var(--color-site-muted)", fontSize: "0.85rem" }}>
                  {formatDate(match.startTime)}
                </span>
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--color-site-muted)" }}>
                Formátum: {match.format} | Gördülő Tippek: <span style={{ color: "var(--color-patch-gold)" }}>{match._count.predictions}</span> db
              </div>
              {match.winner && (
                <div style={{ fontSize: "0.8rem", color: "var(--color-site-white)", marginTop: "0.5rem", fontWeight: 700 }}>
                  Végeredmény Nyertes: <span style={{ color: "var(--color-esport-teal)" }}>{match.winner}</span>
                </div>
              )}
            </div>
            
            <MatchStatusActions 
              id={match.id} 
              teamA={match.teamA} 
              teamB={match.teamB} 
              status={match.status} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
