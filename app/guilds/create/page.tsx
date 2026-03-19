"use client";

import { useState } from "react";
import { createGuild } from "@/actions/social";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CreateGuildPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;
    setError(null);
    setLoading(true);

    const result = await createGuild(name, desc);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(`/guilds/${result.guildId}`);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "4rem auto 10rem auto", padding: "0 1.5rem" }}>
      <header style={{ marginBottom: "2rem", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "1rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "2rem", textTransform: "uppercase", margin: 0, color: "var(--color-esport-teal)" }}>
          Klán Alapítása
        </h1>
        <p style={{ color: "var(--color-site-muted)", margin: "0.5rem 0 0 0" }}>
          Hozz létre egy új közösséget, hívj meg tagokat és kezdjetek el együtt játszani!
        </p>
      </header>

      {error && (
        <div style={{ background: "rgba(255,70,85,0.1)", color: "var(--color-val-red)", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid rgba(255,70,85,0.3)", fontWeight: 700 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", padding: "2rem", borderRadius: "12px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "white", fontSize: "0.875rem" }}>
            Közösség Neve <span style={{ color: "var(--color-val-red)" }}>*</span>
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pl. Radiant Elit, Magyar Valorant Osztag..."
            maxLength={30}
            style={{ padding: "0.75rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "white", fontSize: "0.875rem" }}>
            Leírás (Opcionális)
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Mivel foglalkoztok? Milyen rankon játszotok?"
            rows={4}
            maxLength={300}
            style={{ padding: "0.75rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white", resize: "vertical" }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !name.trim()} 
          className="admin-btn-primary"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "1rem", opacity: (loading || !name.trim()) ? 0.5 : 1 }}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Klán Létrehozása"}
        </button>
      </form>
    </div>
  );
}
