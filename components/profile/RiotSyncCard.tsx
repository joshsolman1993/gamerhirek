"use client";

import { useState, useTransition } from "react";
import { verifyAndSyncRiotAccount, unlinkRiotAccount } from "@/actions/riot";
import { Link, RefreshCw, CheckCircle } from "lucide-react";

type Props = {
  riotId: string | null;
  riotRank: string | null;
  riotLevel: number | null;
  lastSync: Date | null;
};

export function RiotSyncCard({ riotId, riotRank, riotLevel, lastSync }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const [riotInput, setRiotInput] = useState("");

  function handleSync(e: React.FormEvent) {
    e.preventDefault();
    if (!riotInput.includes("#")) {
      setMessage({ text: "Kérlek Név#TAG formátumban add meg!", type: "error" });
      return;
    }

    startTransition(async () => {
      setMessage(null);
      const res = await verifyAndSyncRiotAccount(riotInput);
      if (res.error) {
        setMessage({ text: res.error, type: "error" });
      } else {
        setMessage({ text: "Fiók sikeresen csatolva és szinkronizálva!", type: "success" });
        setRiotInput(""); // Reset inside block
      }
    });
  }

  function handleUnlink() {
    startTransition(async () => {
      setMessage(null);
      const res = await unlinkRiotAccount();
      if (res.error) {
        setMessage({ text: res.error, type: "error" });
      } else {
        setMessage({ text: "Fiók sikeresen lecsatolva.", type: "success" });
      }
    });
  }

  function handleRefresh() {
    if (!riotId) return;
    startTransition(async () => {
      setMessage(null);
      const res = await verifyAndSyncRiotAccount(riotId); // Re-sync existing account
      if (res.error) {
        setMessage({ text: res.error, type: "error" });
      } else {
        setMessage({ text: "Szinkronizáció frissítve!", type: "success" });
      }
    });
  }

  return (
    <div style={{ background: "rgba(255, 70, 85, 0.05)", border: "1px solid rgba(255, 70, 85, 0.2)", borderRadius: "8px", padding: "1.5rem", marginTop: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <Link style={{ color: "var(--color-val-red)" }} size={24} />
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", textTransform: "uppercase", margin: 0 }}>Riot Games Fiók</h3>
      </div>
      
      <p style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", marginBottom: "1.5rem", maxWidth: "600px" }}>
        Csatold a hivatalos Valorant fiókodat a profilodhoz, hogy az oldal automatikusan átemelje a rangodat és az account szintedet. 
        Ez a Csapatkereső (LFG) részlegen &quot;Hitelesített&quot; szűrőt ad neked, így a többiek is láthatják, hogy valós adatokat adtál meg!
      </p>

      {message && (
        <div style={{ padding: "0.75rem", background: message.type === "error" ? "rgba(255, 70, 85, 0.1)" : "rgba(0, 255, 127, 0.1)", color: message.type === "error" ? "var(--color-val-red)" : "#00FF7F", borderRadius: "4px", marginBottom: "1.5rem", fontSize: "0.875rem", fontWeight: 700 }}>
          {message.text}
        </div>
      )}

      {riotId ? (
        <div style={{ background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--color-site-border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-site-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Csatolt Fiók</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>{riotId}</span>
                <CheckCircle size={18} color="#00FF7F" />
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-site-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Hivatalos Rang</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-esport-teal)" }}>{riotRank || "Unranked"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-site-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Szint</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-site-white)" }}>{riotLevel}</div>
              </div>
            </div>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--color-site-muted)" }}>Utolsó szinkronizáció: {lastSync ? new Date(lastSync).toLocaleString("hu-HU") : "Soha"}</span>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                onClick={handleRefresh} 
                disabled={isPending}
                style={{ background: "transparent", color: "var(--color-esport-teal)", border: "1px solid var(--color-esport-teal)", padding: "0.5rem 1rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", cursor: isPending ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {isPending ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />} 
                Frissítés
              </button>
              <button 
                onClick={handleUnlink} 
                disabled={isPending}
                style={{ background: "transparent", color: "var(--color-site-muted)", border: "1px solid var(--color-site-muted)", padding: "0.5rem 1rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", cursor: isPending ? "not-allowed" : "pointer" }}
              >
                Lecsatolás
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSync} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "1", minWidth: "250px" }}>
            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--color-site-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.5rem" }}>Riot ID (Név#TAG)</label>
            <input 
              type="text" 
              value={riotInput}
              onChange={(e) => setRiotInput(e.target.value)}
              placeholder="JettMester#EUNE" 
              disabled={isPending}
              style={{ width: "100%", padding: "0.75rem 1rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "#fff", borderRadius: "4px", fontFamily: "var(--font-sans)", fontSize: "1rem" }}
            />
          </div>
          <button 
            type="submit" 
            disabled={isPending || !riotInput.includes("#")}
            style={{ padding: "0.75rem 1.5rem", background: isPending || !riotInput.includes("#") ? "rgba(255, 70, 85, 0.5)" : "var(--color-val-red)", color: "#fff", border: "none", borderRadius: "4px", fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", cursor: (isPending || !riotInput.includes("#")) ? "not-allowed" : "pointer" }}
          >
            {isPending ? "Keresés..." : "Fiók Csatolása"}
          </button>
        </form>
      )}
    </div>
  );
}
