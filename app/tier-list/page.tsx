import { TierListBuilder } from "@/components/TierListBuilder";
import { ListTree } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ágens Tier List Builder | GamerHírek",
  description: "Állítsd össze a saját Valorant ágens tier listedet és oszd meg a barátaiddal!",
};

export default function TierListPage() {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <header style={{ marginBottom: "3rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", textAlign: "center" }}>
        <div style={{ background: "rgba(0, 196, 180, 0.1)", color: "var(--color-esport-teal)", padding: "0.5rem 1rem", borderRadius: "100px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <ListTree size={16} /> Meta Elemzés
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3.5rem)", textTransform: "uppercase", letterSpacing: "0.02em", margin: 0, lineHeight: 1.1 }}>
          Ágens <span style={{ color: "var(--color-val-red)" }}>Tier List</span> Builder
        </h1>
        <p style={{ color: "var(--color-site-muted)", maxWidth: "600px", fontSize: "1.125rem", margin: 0 }}>
          Húzd be az ágenseket a megfelelő kategóriákba, hogy létrehozd a saját értékelésed. Ha kész vagy, mentsd el és oszd meg az egyedi linkedet!
        </p>
      </header>

      <div style={{ padding: "2rem", background: "rgba(15,25,35,0.4)", border: "1px solid var(--color-site-border)", borderRadius: "12px", boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)" }}>
        <TierListBuilder />
      </div>

    </div>
  );
}
