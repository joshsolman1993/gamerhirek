"use client";

import { useTransition, useRef, useState } from "react";
import { createLFGPost } from "@/actions/lfg";
import { Send, MapPin, Mic, Medal, Users } from "lucide-react";

export function LFGCreationForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error", text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    
    startTransition(async () => {
      setMsg(null);
      const res = await createLFGPost(formData);
      
      if (res.error) {
        setMsg({ type: "error", text: res.error });
      } else {
        setMsg({ type: "success", text: "Hirdetés sikeresen feladva!" });
        formRef.current?.reset();
        
        // Clear success msg after 3 seconds
        setTimeout(() => setMsg(null), 3000);
      }
    });
  };

  return (
    <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-esport-teal)", padding: "2rem", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", marginBottom: "3rem" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", textTransform: "uppercase", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Users size={20} style={{ color: "var(--color-esport-teal)" }} />
        Új <span style={{ color: "var(--color-esport-teal)" }}>Csapatkereső</span> Hirdetés
      </h2>

      {msg && (
        <div style={{ 
          background: msg.type === "success" ? "rgba(0, 196, 180, 0.1)" : "rgba(255, 70, 85, 0.1)", 
          border: `1px solid ${msg.type === "success" ? "var(--color-esport-teal)" : "var(--color-val-red)"}`, 
          color: msg.type === "success" ? "var(--color-esport-teal)" : "var(--color-val-red)", 
          padding: "1rem", borderRadius: "8px", fontWeight: 600, marginBottom: "1.5rem", textAlign: "center" 
        }}>
          {msg.text}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* TEXTAREA */}
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", color: "var(--color-site-muted)", marginBottom: "0.5rem", fontWeight: 600 }}>Kit keresel? (Min. 5 karakter)</label>
          <textarea 
            name="content"
            required
            minLength={5}
            maxLength={300}
            rows={3}
            placeholder="Pl.: Két embert keresek Premierre. Legyél chill, ne flame-elj. Mi Controller és Sentinel mainek vagyunk."
            style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-site-border)", color: "#fff", padding: "1rem", borderRadius: "8px", fontSize: "1rem", resize: "none" }}
          />
        </div>

        {/* METADATA ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", color: "var(--color-site-muted)", marginBottom: "0.5rem", fontWeight: 600 }}><Medal size={16}/> Elvárt Rank</label>
            <select name="rank" style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-site-border)", color: "#fff", padding: "0.75rem", borderRadius: "8px", fontSize: "0.875rem" }}>
              <option value="Bármilyen">Bármilyen</option>
              <option value="Iron - Bronze">Iron - Bronze</option>
              <option value="Silver - Gold">Silver - Gold</option>
              <option value="Platinum - Diamond">Platinum - Diamond</option>
              <option value="Ascendant+">Ascendant+</option>
            </select>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", color: "var(--color-site-muted)", marginBottom: "0.5rem", fontWeight: 600 }}><Users size={16}/> Keresett Szerepkör</label>
            <select name="roles" style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-site-border)", color: "#fff", padding: "0.75rem", borderRadius: "8px", fontSize: "0.875rem" }}>
              <option value="Bármilyen">Bármilyen</option>
              <option value="Duelist">Duelist</option>
              <option value="Initiator">Initiator</option>
              <option value="Controller">Controller</option>
              <option value="Sentinel">Sentinel</option>
            </select>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", color: "var(--color-site-muted)", marginBottom: "0.5rem", fontWeight: 600 }}><MapPin size={16}/> Szerver</label>
            <select name="server" style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-site-border)", color: "#fff", padding: "0.75rem", borderRadius: "8px", fontSize: "0.875rem" }}>
              <option value="Frankfurt">Frankfurt</option>
              <option value="London">London</option>
              <option value="Paris">Paris</option>
              <option value="Stockholm">Stockholm</option>
              <option value="Bármelyik EU">Bármelyik EU</option>
            </select>
          </div>
        </div>

        {/* FOOTER ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-site-border)", paddingTop: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--color-site-muted)" }}>
            <input type="checkbox" name="mic" defaultChecked style={{ width: "18px", height: "18px", accentColor: "var(--color-esport-teal)" }} />
            <Mic size={18} /> <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Mikrofon Kötelező</span>
          </label>

          <button 
            type="submit" 
            disabled={isPending}
            style={{ 
              background: "var(--color-val-red)", color: "white", border: "none", 
              padding: "0.75rem 2rem", borderRadius: "4px", fontFamily: "var(--font-display)", fontWeight: 700, 
              display: "flex", alignItems: "center", gap: "0.5rem", cursor: isPending ? "not-allowed" : "pointer", 
              opacity: isPending ? 0.7 : 1, transition: "background 0.2s"
            }}
          >
            {isPending ? "KÜLDÉS..." : "HIRDETÉS FELADÁSA"} <Send size={18} />
          </button>
        </div>

      </form>
    </div>
  );
}
