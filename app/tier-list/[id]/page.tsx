import { getTierList } from "@/actions/tierlists";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { TIER_ROWS, AGENTS, type ValorantAgent } from "@/lib/agents";

// Render view matching TierListBuilder's visual layout
export default async function ViewTierListPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const list = await getTierList(resolvedParams.id);
  
  if (!list) {
    return notFound();
  }

  // Parse items from JSON
  const items = list.data as unknown as Record<string, ValorantAgent[]>;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem", minHeight: "80vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "2rem" }}>
        <div>
          <Link href="/tier-list" style={{ color: "var(--color-site-muted)", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", textDecoration: "none" }}>
             <ArrowLeft size={16} /> Vissza a szerkesztőhöz
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "2.5rem", textTransform: "uppercase", letterSpacing: "0.02em", margin: "0 0 0.5rem 0", color: "var(--color-site-white)" }}>
            {list.title}
          </h1>
          <p style={{ color: "var(--color-site-muted)", margin: 0, fontSize: "0.875rem" }}>
            Készítette: {list.user?.name || "Vendég"} • {new Date(list.createdAt).toLocaleDateString("hu-HU")}
          </p>
        </div>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", background: "var(--color-site-card)", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--color-site-border)", marginBottom: "3rem" }}>
        {TIER_ROWS.map((row) => (
          <div key={row.id} style={{ display: "flex", gap: "0.5rem", minHeight: "100px", borderBottom: row.id !== "d" ? "1px solid rgba(255,255,255,0.05)" : "none", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>
            <div style={{ width: "100px", minWidth: "100px", background: row.color, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", flexShrink: 0 }}>
              <span style={{ color: "#000", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem" }}>{row.label}</span>
            </div>
            
            <div style={{ flex: 1, padding: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", background: "rgba(0,0,0,0.2)", borderRadius: "4px" }}>
              {items[row.id]?.map((agent) => (
                <div key={agent.id} style={{ width: "80px", height: "80px", border: "2px solid rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
                   <Image src={agent.imageUrl} alt={agent.name} fill style={{ objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
         <Link href="/tier-list" className="admin-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
             Állítsd össze a saját listádat! <ExternalLink size={16} />
         </Link>
      </div>
    </div>
  );
}
