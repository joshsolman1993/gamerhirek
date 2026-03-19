import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Users, Calendar, Crown, Shield } from "lucide-react";
import { JoinGuildButton } from "./JoinGuildButton";
import { GuildChatInput } from "./GuildChatInput";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const guild = await db.guild.findUnique({ where: { id: resolvedParams.id } });
  if (!guild) return { title: "Nem található klán" };
  return { title: `${guild.name} | Klánok | GamerHírek` };
}

export default async function GuildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getSession();
  
  const guild = await db.guild.findUnique({
    where: { id: resolvedParams.id },
    include: {
      members: {
        include: { user: true },
        orderBy: { joinedAt: "asc" }
      },
      chats: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 50
      }
    }
  });

  if (!guild) {
    return notFound();
  }

  // Check if current user is a member
  const isMember = session ? guild.members.some(m => m.userId === session.id) : false;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", minHeight: "80vh" }}>
      {/* ── Bal Oldal: Klán Fejléc + Chat Fal ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", minWidth: 0 }}>
        <Link href="/guilds" style={{ color: "var(--color-site-muted)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase" }}>
          <ArrowLeft size={16} /> Vissza a Klánokhoz
        </Link>
        
        <header style={{ background: "linear-gradient(135deg, var(--color-site-card) 0%, rgba(15,25,35,1) 100%)", border: "1px solid var(--color-esport-teal)", borderRadius: "12px", padding: "2.5rem 2rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "300px", background: "radial-gradient(circle, rgba(0, 196, 180, 0.1) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1, gap: "1.5rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                <ShieldCheck size={36} color="var(--color-esport-teal)" />
                <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "2.5rem", margin: 0, color: "var(--color-site-white)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                  {guild.name}
                </h1>
              </div>
              <p style={{ color: "var(--color-site-muted)", margin: "0 0 1.5rem 0", maxWidth: "600px", lineHeight: 1.6 }}>
                {guild.description || "Nincs megadva leírás."}
              </p>
              
              <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem", color: "var(--color-site-muted)", fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Users size={16} color="var(--color-patch-gold)" /> Tagok: {guild.members.length}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={16} /> {new Date(guild.createdAt).toLocaleDateString("hu-HU")}</span>
              </div>
            </div>
            
            <JoinGuildButton guildId={guild.id} isMember={isMember} isAuthenticated={!!session?.id} />
          </div>
        </header>

        {isMember ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", margin: 0, color: "var(--color-site-white)", textTransform: "uppercase" }}>Guild Chat Fal</h2>
            </div>
            
            <div style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column-reverse", gap: "1rem", overflowY: "auto", maxHeight: "500px" }}>
              {guild.chats.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--color-site-muted)", opacity: 0.5, fontStyle: "italic", padding: "2rem" }}>
                  Még nem írt senki. Légy te az első!
                </div>
              ) : (
                guild.chats.map((chat) => (
                  <div key={chat.id} style={{ display: "flex", gap: "1rem", background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                      {chat.user.avatarUrl ? (
                         <Image src={chat.user.avatarUrl} alt={chat.user.name} width={40} height={40} style={{ objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "var(--color-site-border)" }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <Link href={`/profil/${chat.user.id}`} style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-site-white)", fontSize: "0.875rem", textDecoration: "none" }}>{chat.user.name}</Link>
                        <span style={{ fontSize: "0.65rem", color: "var(--color-site-muted)" }}>{chat.createdAt.toLocaleString("hu-HU", { hour: "2-digit", minute: "2-digit", month: "long", day: "numeric" })}</span>
                      </div>
                      <div style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", lineHeight: 1.5, wordBreak: "break-word" }}>
                        {chat.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
               <GuildChatInput guildId={guild.id} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem", border: "1px dashed var(--color-esport-teal)", borderRadius: "12px", background: "rgba(0, 196, 180, 0.05)" }}>
            <ShieldCheck size={48} color="var(--color-esport-teal)" style={{ opacity: 0.5, margin: "0 auto 1rem auto" }} />
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--color-site-white)", textTransform: "uppercase" }}>Csatlakozz a klánhoz a chat megnyitásához</h3>
            <p style={{ color: "var(--color-site-muted)", margin: "0.5rem auto 0 auto", maxWidth: "400px" }}>A belső kommunikáció és a közösségi posztok csak a klán rögzített tagjai számára láthatóak és szerkeszthetőek.</p>
          </div>
        )}
      </div>

      {/* ── Jobb Oldal: Taglista ── */}
      <aside style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "12px", padding: "1.5rem" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", margin: "0 0 1.5rem 0", color: "var(--color-site-white)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={20} color="var(--color-patch-gold)" /> Klán Taglista
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {guild.members.map((member) => (
              <div key={member.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <Link href={`/profil/${member.user.id}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-site-border)", overflow: "hidden" }}>
                    {member.user.avatarUrl && <Image src={member.user.avatarUrl} alt={member.user.name} width={32} height={32} style={{ objectFit: "cover" }} />}
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-site-white)" }}>
                    {member.user.name}
                  </span>
                </Link>
                
                {member.role === "FOUNDER" ? (
                   <span title="Alapító"><Crown size={16} color="var(--color-patch-gold)" /></span>
                ) : member.role === "MODERATOR" ? (
                   <span title="Moderátor"><Shield size={16} color="var(--color-esport-teal)" /></span>
                ) : (
                   <span style={{ fontSize: "0.75rem", color: "var(--color-site-muted)", background: "rgba(255,255,255,0.1)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>Tag</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
