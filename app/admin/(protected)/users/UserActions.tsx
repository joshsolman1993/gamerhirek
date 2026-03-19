"use client";

import { useState } from "react";
import { updateUser } from "@/actions/admin";

export function UserActions({ userId, currentXp, role }: { userId: string; currentXp: number; role: string }) {
  const [xp, setXp] = useState(currentXp.toString());
  const [loading, setLoading] = useState(false);

  const handleUpdateXp = async () => {
    setLoading(true);
    await updateUser(userId, { xp: parseInt(xp) || 0 });
    setLoading(false);
  };

  const handleToggleBan = async () => {
    setLoading(true);
    const newRole = role === "BANNED" ? "USER" : "BANNED";
    await updateUser(userId, { role: newRole });
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input 
          type="number"
          value={xp}
          onChange={(e) => setXp(e.target.value)}
          style={{
            background: "var(--color-site-bg)",
            border: "1px solid var(--color-site-border)",
            color: "var(--color-site-white)",
            fontFamily: "var(--font-display)",
            padding: "0.25rem 0.5rem",
            width: "80px",
            fontSize: "0.75rem",
            borderRadius: "4px"
          }}
          disabled={loading}
        />
        <button
          onClick={handleUpdateXp}
          disabled={loading}
          className="admin-btn-secondary"
          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
        >
          XP Mentése
        </button>
      </div>

      {role !== "ADMIN" && (
        <button
          onClick={handleToggleBan}
          disabled={loading}
          style={{
            background: role === "BANNED" ? "var(--color-esport-teal)" : "var(--color-val-red)",
            color: role === "BANNED" ? "var(--color-site-bg)" : "white",
            border: "none",
            padding: "0.35rem 0.75rem",
            fontSize: "0.75rem",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: "4px",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s ease"
          }}
        >
          {role === "BANNED" ? "Feloldás" : "Kitiltás"}
        </button>
      )}
      
      {role === "BANNED" && (
        <span style={{ color: "var(--color-val-red)", fontSize: "0.75rem", fontWeight: 700 }}>
          BANNOLVA
        </span>
      )}
      {role === "ADMIN" && (
        <span style={{ color: "var(--color-patch-gold)", fontSize: "0.75rem", fontWeight: 700 }}>
          ADMIN
        </span>
      )}
    </div>
  );
}
