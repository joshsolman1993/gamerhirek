"use client";

import { useState, useTransition, useEffect } from "react";
import { setFavoriteTeam } from "@/actions/economy";

type Props = {
  currentTeam: string | null;
  changedAt: Date | null;
};

export const ESPORT_TEAMS = [
  { name: "FNATIC", color: "#FF5900" },
  { name: "Paper Rex", color: "#FF0055" },
  { name: "LOUD", color: "#00FF00" },
  { name: "Sentinels", color: "#CE0037" },
  { name: "G2 Esports", color: "#111111" },
  { name: "NAVI", color: "#FFEE00" }
];

export function TeamSelector({ currentTeam, changedAt }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (!changedAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const changed = new Date(changedAt);
      const diffMs = now.getTime() - changed.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours >= 3) {
        setCooldownRemaining(null);
      } else {
        const remainingMs = (3 * 60 * 60 * 1000) - diffMs;
        const remainingMinutes = Math.floor(remainingMs / (1000 * 60));
        setCooldownRemaining(`${remainingMinutes} perc múlva válthatsz`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [changedAt]);

  function handleSelect(teamName: string) {
    if (cooldownRemaining) {
      setMessage({ text: cooldownRemaining, type: "error" });
      return;
    }

    startTransition(async () => {
      const result = await setFavoriteTeam(teamName);
      if (result.error) {
        setMessage({ text: result.error, type: "error" });
      } else {
        setMessage({ text: "Sikeres csapatválasztás!", type: "success" });
      }
    });
  }

  return (
    <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "8px", padding: "1.5rem", marginTop: "2rem" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", textTransform: "uppercase", margin: "0 0 1rem 0" }}>Kedvenc E-sport Csapat</h3>
      <p style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
        Válaszd ki a kedvenc csapatod. Ha nyernek, extra XP-t kapsz! <strong>Figyelem: Csapatot 3 óránként csak egyszer válthatsz.</strong>
      </p>

      {message && (
        <div style={{ padding: "0.75rem", background: message.type === "error" ? "rgba(255, 70, 85, 0.1)" : "rgba(0, 255, 127, 0.1)", color: message.type === "error" ? "var(--color-val-red)" : "#00FF7F", borderRadius: "4px", marginBottom: "1rem", fontSize: "0.875rem", fontWeight: 700 }}>
          {message.text}
        </div>
      )}

      {cooldownRemaining && (
        <div style={{ marginBottom: "1rem", color: "var(--color-val-red)", fontSize: "0.875rem", fontWeight: 700 }}>
          ⏳ Várakozás szükséges: {cooldownRemaining}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1rem" }}>
        {ESPORT_TEAMS.map((team) => {
          const isSelected = currentTeam === team.name;
          return (
            <button
              key={team.name}
              onClick={() => handleSelect(team.name)}
              disabled={isPending || Boolean(cooldownRemaining && !isSelected)}
              style={{
                background: isSelected ? team.color : "rgba(255,255,255,0.05)",
                color: isSelected ? (team.name === "NAVI" ? "#000" : "#fff") : "var(--color-site-white)",
                border: `2px solid ${isSelected ? team.color : "var(--color-site-border)"}`,
                borderRadius: "4px",
                padding: "0.75rem",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: (cooldownRemaining || isPending) ? "not-allowed" : "pointer",
                transition: "all 0.2s"
              }}
            >
              {team.name}
              {isSelected && " ✓"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
