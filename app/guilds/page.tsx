import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Shield, Users, PlusCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Közösségek | GamerHírek",
  description: "Böngéssz a GamerHírek Valorant klánjai között, csatlakozz vagy alapíts saját csapatot!",
};

export default async function GuildsPage() {
  const session = await getSession();
  
  const guilds = await db.guild.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { members: true, chats: true }
      }
    }
  });

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem", minHeight: "80vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "2.5rem", textTransform: "uppercase", letterSpacing: "0.02em", margin: 0, color: "var(--color-site-white)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Shield size={32} color="var(--color-esport-teal)" />
            Közösségek
          </h1>
          <p style={{ color: "var(--color-site-muted)", margin: "0.5rem 0 0 0" }}>
            Találd meg a számodra megfelelő Valorant klánt, vagy hozz létre sajátot!
          </p>
        </div>

        {session?.id ? (
          <Link href="/guilds/create" className="admin-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem" }}>
            <PlusCircle size={20} /> Új Klán Alapítása
          </Link>
        ) : (
          <Link href="/login?next=/guilds" className="admin-btn-secondary">
            Jelentkezz be klán alapításhoz
          </Link>
        )}
      </header>

      {guilds.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--color-site-muted)", padding: "4rem", border: "1px dashed var(--color-site-border)", borderRadius: "12px", background: "rgba(255,255,255,0.02)" }}>
          <Shield size={48} style={{ opacity: 0.5, marginBottom: "1rem" }} />
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", textTransform: "uppercase", fontWeight: 700 }}>Még nincsenek klánok</p>
          <p>Légy te az első, aki megalapítja csapatát a platformon!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {guilds.map((guild) => (
            <Link key={guild.id} href={`/guilds/${guild.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--color-site-card)",
                border: "1px solid var(--color-site-border)",
                borderRadius: "12px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                transition: "all 0.2s ease",
                cursor: "pointer",
                height: "100%",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--color-esport-teal)"; e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(0, 196, 180, 0.2)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--color-site-border)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", color: "var(--color-site-white)", textTransform: "uppercase", margin: 0, wordBreak: "break-word" }}>
                    {guild.name}
                  </h2>
                  <Shield size={24} style={{ color: "var(--color-site-muted)", opacity: 0.5 }} />
                </div>
                
                {guild.description ? (
                  <p style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", margin: 0, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {guild.description}
                  </p>
                ) : (
                  <p style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", margin: 0, flex: 1, fontStyle: "italic", opacity: 0.5 }}>
                    Nincs megadva leírás.
                  </p>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "0.85rem", color: "var(--color-site-white)", fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Users size={16} style={{ color: "var(--color-patch-gold)" }} />
                    {guild._count.members} Tag
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-esport-teal)" }} />
                    {guild._count.chats} Üzenet
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
