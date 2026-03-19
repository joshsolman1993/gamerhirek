"use client";

import { useState } from "react";
import { Mail, CheckCircle, Crosshair } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const popularTeams = ["FNC", "NAVI", "KC", "TH", "G2", "SEN"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, team: team || undefined }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setMessage(data.error || "Hiba történt!");
      }
    } catch {
      setStatus("error");
      setMessage("Hálózati hiba!");
    }
  }

  if (status === "success") {
    return (
      <div style={{ background: "rgba(0, 196, 180, 0.1)", border: "1px solid var(--color-esport-teal)", padding: "2rem", borderRadius: "8px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <CheckCircle size={48} color="var(--color-esport-teal)" />
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", margin: 0, color: "var(--color-site-white)", textTransform: "uppercase" }}>
          Sikeres feliratkozás!
        </h3>
        <p style={{ color: "var(--color-esport-teal)", margin: 0 }}>
          Hamarosan kézbesítjük az első személyre szabott e-sport hírleveledet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(30,41,59,0.5) 0%, rgba(15,25,35,0.8) 100%)", border: "1px solid var(--color-site-border)", borderTop: "3px solid var(--color-val-red)", padding: "2rem", borderRadius: "8px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.05, transform: "rotate(15deg)", pointerEvents: "none" }}>
        <Mail size={120} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-val-red)", marginBottom: "0.5rem" }}>
          <Mail size={20} strokeWidth={2.5} />
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Exkluzív Esport Hírlevél
          </h3>
        </div>
        <p style={{ color: "var(--color-site-muted)", marginBottom: "1.5rem", lineHeight: 1.6, fontSize: "0.9375rem" }}>
          Iratkozz fel heti hírlevelünkre, add meg a kedvenc csapatod és személyre szabott cikkeket, mérkőzés értesítőket kapsz! Ne maradj le a kedvenced meccseiről!
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
              <label htmlFor="newsletter-email" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-site-muted)" }}>
                E-mail Címed *
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="pelda.jani@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-site-border)", color: "#fff", padding: "0.75rem 1rem", borderRadius: "4px", fontSize: "1rem" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "140px" }}>
              <label htmlFor="newsletter-team" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-site-muted)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                Kedvenc <Crosshair size={12} />
              </label>
              <select
                id="newsletter-team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-site-border)", color: team ? "#fff" : "var(--color-site-muted)", padding: "0.75rem 0.5rem", borderRadius: "4px", fontSize: "0.875rem", fontFamily: "var(--font-base)" }}
              >
                <option value="">(Tetszőleges)</option>
                {popularTeams.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="admin-btn-primary"
            style={{ 
              width: "100%", 
              background: "var(--color-val-red)", 
              color: "#fff", 
              border: "none", 
              opacity: status === "loading" ? 0.7 : 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              letterSpacing: "0.1em"
            }}
          >
            {status === "loading" ? "Feliratkozás..." : "Kérem a belsős infókat"}
          </button>

          {status === "error" && (
            <div style={{ color: "var(--color-val-red)", fontSize: "0.875rem", textAlign: "center" }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
