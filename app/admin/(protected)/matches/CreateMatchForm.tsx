"use client";

import { useState } from "react";
import { createMatch } from "@/actions/admin";

export function CreateMatchForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [format, setFormat] = useState("BO3");
  const [startTime, setStartTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createMatch({
      teamA,
      teamB,
      format,
      startTime
    });
    setLoading(false);
    setOpen(false);
    setTeamA("");
    setTeamB("");
    setStartTime("");
  };

  if (!open) {
    return (
      <button className="admin-btn-primary" onClick={() => setOpen(true)}>
        + Új Meccs Létrehozása
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.8)",
      zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "var(--color-site-card)",
        border: "1px solid var(--color-esport-teal)",
        padding: "2rem",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "500px",
      }}>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-site-white)", marginTop: 0, textTransform: "uppercase" }}>Új Pick&apos;em Meccs</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "center" }}>
            <input required placeholder="Csapat A (pl. FNATIC)" value={teamA} onChange={(e) => setTeamA(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white" }} />
            <span style={{ color: "var(--color-val-red)", fontWeight: 700 }}>VS</span>
            <input required placeholder="Csapat B (pl. NAVI)" value={teamB} onChange={(e) => setTeamB(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white" }} />
          </div>

          <input required placeholder="Formátum (pl. BO3, BO5)" value={format} onChange={(e) => setFormat(e.target.value)}
            style={{ padding: "0.5rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white" }} />
          
          <input required type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)}
            style={{ padding: "0.5rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white" }} />

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="submit" disabled={loading} className="admin-btn-primary" style={{ flex: 1, textAlign: "center", opacity: loading ? 0.5 : 1 }}>Létrehozás</button>
            <button type="button" disabled={loading} onClick={() => setOpen(false)} className="admin-btn-secondary" style={{ padding: "0 2rem" }}>Mégse</button>
          </div>
        </form>
      </div>
    </div>
  );
}
