"use client";

import { useState } from "react";
import { updateMatchResult, deleteMatch } from "@/actions/admin";

export function MatchStatusActions({ id, teamA, teamB, status }: { id: string; teamA: string; teamB: string; status: string }) {
  const [loading, setLoading] = useState(false);

  const handleSetWinner = async (winner: string) => {
    if (!confirm(`Biztosan kihirdeted a győztest: ${winner}? (A Pick'em tippelőknek lezárásra kerül, de az XP reward engine is számolhat vele)`)) return;
    setLoading(true);
    await updateMatchResult(id, winner);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Biztosan törlöd a meccset és az összes hozzá tartozó Pick'em tippet véglegesen?")) return;
    setLoading(true);
    await deleteMatch(id);
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderLeft: "1px solid var(--color-site-border)", paddingLeft: "1.5rem" }}>
      {status === "UPCOMING" && (
        <>
          <span style={{ fontSize: "0.75rem", color: "var(--color-site-muted)", textTransform: "uppercase" }}>Győztes:</span>
          <button
            onClick={() => handleSetWinner(teamA)}
            disabled={loading}
            className="admin-btn-secondary"
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", background: "rgba(0,196,180,0.1)", color: "var(--color-esport-teal)" }}
          >
            {teamA}
          </button>
          <button
            onClick={() => handleSetWinner(teamB)}
            disabled={loading}
            className="admin-btn-secondary"
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", background: "rgba(0,196,180,0.1)", color: "var(--color-esport-teal)" }}
          >
            {teamB}
          </button>
        </>
      )}

      <button
        onClick={handleDelete}
        disabled={loading}
        style={{
          background: "transparent",
          color: "var(--color-val-red)",
          border: "1px solid var(--color-val-red)",
          padding: "0.25rem 0.5rem",
          fontSize: "0.75rem",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          textTransform: "uppercase",
          cursor: "pointer",
          borderRadius: "4px",
          marginLeft: "0.5rem",
          opacity: loading ? 0.7 : 1,
        }}
      >
        Törlés
      </button>
    </div>
  );
}
