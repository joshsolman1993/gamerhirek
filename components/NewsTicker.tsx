import { db } from "@/lib/db";
import { Zap } from "lucide-react";

export async function NewsTicker() {
  // Fetch up to 10 latest completed matches
  const matches = await db.match.findMany({
    where: { status: "COMPLETED" },
    orderBy: { startTime: "desc" },
    take: 10,
  });

  if (!matches || matches.length === 0) return null;

  return (
    <div style={{
      width: "100%",
      background: "var(--color-site-card)",
      borderBottom: "1px solid var(--color-esport-teal)",
      color: "var(--color-site-white)",
      display: "flex",
      alignItems: "center",
      height: "32px",
      fontSize: "0.75rem",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      letterSpacing: "0.05em",
      overflow: "hidden",
      position: "relative",
    }}>
      <div style={{
        background: "var(--color-esport-teal)",
        color: "var(--color-site-bg)",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 1rem",
        zIndex: 10,
        boxShadow: "5px 0 15px -5px rgba(0,0,0,0.5)",
      }}>
        <Zap size={14} style={{ marginRight: "0.5rem" }} />
        BREAKING
      </div>
      
      <div className="ticker-container" style={{ flex: 1, overflow: "hidden", display: "flex", height: "100%", position: "relative" }}>
        <div className="ticker-track" style={{
          display: "flex",
          whiteSpace: "nowrap",
          alignItems: "center",
          height: "100%",
          paddingLeft: "100%"
        }}>
          {matches.map((match, i) => (
            <div key={`${match.id}-${i}`} style={{ display: "flex", alignItems: "center", padding: "0 2rem", borderLeft: "1px solid var(--color-site-border)" }}>
              <span style={{ color: "var(--color-site-muted)", marginRight: "0.5rem" }}>
                {new Date(match.startTime).toLocaleDateString("hu-HU", { month: "short", day: "numeric" })}
              </span>
              <span style={{ color: "var(--color-site-white)", marginRight: "0.25rem" }}>{match.teamA}</span>
              <span style={{ color: "var(--color-val-red)", margin: "0 0.25rem" }}>vs</span>
              <span style={{ color: "var(--color-site-white)", marginLeft: "0.25rem" }}>{match.teamB}</span>
              {match.winner && (
                <span style={{ color: "var(--color-esport-teal)", marginLeft: "0.75rem", textTransform: "uppercase" }}>
                  Győztes: {match.winner}
                </span>
              )}
            </div>
          ))}
          {matches.map((match, i) => (
            <div key={`${match.id}-dup-${i}`} style={{ display: "flex", alignItems: "center", padding: "0 2rem", borderLeft: "1px solid var(--color-site-border)" }}>
              <span style={{ color: "var(--color-site-muted)", marginRight: "0.5rem" }}>
                {new Date(match.startTime).toLocaleDateString("hu-HU", { month: "short", day: "numeric" })}
              </span>
              <span style={{ color: "var(--color-site-white)", marginRight: "0.25rem" }}>{match.teamA}</span>
              <span style={{ color: "var(--color-val-red)", margin: "0 0.25rem" }}>vs</span>
              <span style={{ color: "var(--color-site-white)", marginLeft: "0.25rem" }}>{match.teamB}</span>
              {match.winner && (
                <span style={{ color: "var(--color-esport-teal)", marginLeft: "0.75rem", textTransform: "uppercase" }}>
                  Győztes: {match.winner}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .ticker-track {
          animation: ticker-scroll 30s linear infinite;
        }
        .ticker-container:hover .ticker-track {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}} />
    </div>
  );
}
