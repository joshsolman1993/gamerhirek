"use client";

import { useTransition, useState } from "react";
import { submitPredictionAction } from "@/actions/pickem";
import Image from "next/image";
import { CheckCircle2, Clock, Swords } from "lucide-react";

type Match = {
  id: string;
  teamA: string;
  teamB: string;
  teamALogo: string | null;
  teamBLogo: string | null;
  startTime: Date;
  format: string;
  winner: string | null;
  status: string;
};

export function PickemMatchList({ 
  matches, 
  userPredictions 
}: { 
  matches: Match[], 
  userPredictions: Record<string, string> 
}) {
  const [isPending, startTransition] = useTransition();
  const [localPredictions, setLocalPredictions] = useState(userPredictions);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePredict = (matchId: string, team: string, status: string) => {
    if (status !== "SCHEDULED") return;

    // Optimistic UI update
    setLocalPredictions(prev => ({ ...prev, [matchId]: team }));
    setErrorMsg(null);

    startTransition(async () => {
      const res = await submitPredictionAction(matchId, team);
      if (res.error) {
        setErrorMsg(res.error);
        // Revert on error
        setLocalPredictions(prev => ({ ...prev, [matchId]: userPredictions[matchId] }));
      }
    });
  };

  if (matches.length === 0) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "var(--color-site-muted)" }}>
        Jelenleg nincsenek meghirdetett e-sport mérkőzések. Visszajelzünk, ha új szezon indul!
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {errorMsg && (
        <div style={{ background: "rgba(255, 70, 85, 0.1)", border: "1px solid var(--color-val-red)", color: "var(--color-val-red)", padding: "1rem", borderRadius: "8px", fontFamily: "var(--font-display)", fontWeight: 600, textAlign: "center" }}>
          {errorMsg}
        </div>
      )}

      {matches.map((match) => {
        const myPrediction = localPredictions[match.id];
        const isScheduled = match.status === "SCHEDULED";
        const isLive = match.status === "LIVE";
        const isCompleted = match.status === "COMPLETED";

        return (
          <div key={match.id} style={{
            background: "var(--color-site-card)",
            border: "1px solid var(--color-site-border)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
            position: "relative"
          }}>
            {/* Header: Time & Status */}
            <div style={{ 
              background: "rgba(0,0,0,0.3)", 
              padding: "0.75rem 1.5rem", 
              borderBottom: "1px solid var(--color-site-border)", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center" 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-site-muted)", fontSize: "0.875rem" }}>
                <Clock size={16} />
                {new Date(match.startTime).toLocaleString("hu-HU", { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                <span style={{ margin: "0 0.5rem" }}>•</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>{match.format}</span>
              </div>

              {isScheduled && <span style={{ color: "var(--color-site-white)", background: "rgba(255,255,255,0.1)", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>HAMAROSAN</span>}
              {isLive && <span style={{ color: "var(--color-val-red)", background: "rgba(255,70,85,0.1)", border: "1px solid var(--color-val-red)", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, fontFamily: "var(--font-display)", animation: "pulse 2s infinite" }}>LIVE</span>}
              {isCompleted && <span style={{ color: "var(--color-site-muted)", padding: "0.25rem 0.5rem", fontSize: "0.75rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>VÉGET ÉRT</span>}
            </div>

            {/* Match Teams & Voting */}
            <div style={{ display: "flex", alignItems: "stretch" }}>
              
              {/* Team A */}
              <button 
                onClick={() => handlePredict(match.id, match.teamA, match.status)}
                disabled={!isScheduled || isPending}
                style={{
                  flex: 1,
                  background: myPrediction === match.teamA ? "rgba(0, 196, 180, 0.15)" : "transparent",
                  border: "none",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  cursor: isScheduled ? "pointer" : "default",
                  transition: "all 0.2s ease",
                  opacity: (!isScheduled && myPrediction !== match.teamA) ? 0.4 : 1,
                  position: "relative"
                }}
                className={isScheduled ? "hover-bg-teal" : ""}
              >
                {myPrediction === match.teamA && (
                  <div style={{ position: "absolute", top: "1rem", left: "1rem", color: "var(--color-esport-teal)" }}>
                    <CheckCircle2 size={24} />
                  </div>
                )}
                {match.teamALogo ? (
                  <Image src={match.teamALogo} alt={match.teamA} width={80} height={80} style={{ objectFit: "contain" }} />
                ) : (
                  <div style={{ width: "80px", height: "80px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
                )}
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", textTransform: "uppercase", color: myPrediction === match.teamA ? "var(--color-esport-teal)" : "var(--color-site-white)" }}>
                  {match.teamA}
                </span>
              </button>

              {/* VS Divider */}
              <div style={{ width: "1px", background: "var(--color-site-border)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ position: "absolute", background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", padding: "0.75rem", borderRadius: "50%", color: "var(--color-site-muted)" }}>
                  <Swords size={20} />
                </div>
              </div>

              {/* Team B */}
              <button 
                onClick={() => handlePredict(match.id, match.teamB, match.status)}
                disabled={!isScheduled || isPending}
                style={{
                  flex: 1,
                  background: myPrediction === match.teamB ? "rgba(0, 196, 180, 0.15)" : "transparent",
                  border: "none",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  cursor: isScheduled ? "pointer" : "default",
                  transition: "all 0.2s ease",
                  opacity: (!isScheduled && myPrediction !== match.teamB) ? 0.4 : 1,
                  position: "relative"
                }}
                className={isScheduled ? "hover-bg-teal" : ""}
              >
                {myPrediction === match.teamB && (
                  <div style={{ position: "absolute", top: "1rem", right: "1rem", color: "var(--color-esport-teal)" }}>
                    <CheckCircle2 size={24} />
                  </div>
                )}
                {match.teamBLogo ? (
                  <Image src={match.teamBLogo} alt={match.teamB} width={80} height={80} style={{ objectFit: "contain" }} />
                ) : (
                  <div style={{ width: "80px", height: "80px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
                )}
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", textTransform: "uppercase", color: myPrediction === match.teamB ? "var(--color-esport-teal)" : "var(--color-site-white)" }}>
                  {match.teamB}
                </span>
              </button>

            </div>

            {/* Results Header (If Completed) */}
            {isCompleted && match.winner && (
              <div style={{ background: "rgba(0, 196, 180, 0.1)", borderTop: "1px solid var(--color-esport-teal)", padding: "1rem", textAlign: "center", color: "var(--color-esport-teal)", fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Győztes: {match.winner}
                {myPrediction === match.winner ? " (Helyes tipp! +50 XP)" : myPrediction ? " (Helytelen tipp)" : ""}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
