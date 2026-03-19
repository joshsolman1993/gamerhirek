/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { LFGCreationForm } from "@/components/LFGCreationForm";
import { formatDistanceToNow } from "date-fns";
import { hu } from "date-fns/locale";
import { MessageSquare, MapPin, Mic, MicOff, Medal, Users } from "lucide-react";
import Image from "next/image";

export const revalidate = 60; // 1 minute ISR

export default async function LFGPage() {
  const session = await getSession();

  const posts = await db.lFGPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          avatarUrl: true
        }
      }
    },
    take: 50 // Limit to 50 latest posts
  });

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "4px", height: "2rem", background: "var(--color-val-red)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-val-red)" }}>
              Keresek Csapatot
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", textTransform: "uppercase", letterSpacing: "0.02em", margin: "0" }}>
            LFG <span style={{ color: "var(--color-val-red)" }}>Fórum</span>
          </h1>
          <p style={{ color: "var(--color-site-muted)", fontSize: "1rem", maxWidth: "560px", margin: "0.5rem 0 0 0" }}>
            Találd meg a tökéletes társat Rankedre, Premierre, vagy csak egy chill Unrated meccsre.
          </p>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        
        {/* LFG Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {posts.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "var(--color-site-muted)", background: "rgba(0,0,0,0.3)", borderRadius: "12px", border: "1px dashed var(--color-site-border)" }}>
              <Users size={48} style={{ opacity: 0.2, margin: "0 auto 1rem" }} />
              Jelenleg nincsenek aktív hirdetések. Legyél te az első, aki csapatot keres!
            </div>
          ) : (
            posts.map((post: any) => (
              <div key={post.id} style={{ 
                background: "var(--color-site-card)", 
                border: "1px solid var(--color-site-border)", 
                borderLeft: "4px solid var(--color-val-red)",
                padding: "1.5rem", 
                borderRadius: "8px", 
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                transition: "transform 0.2s ease"
              }} className="hover:translate-y-[-2px]">
                
                {/* Header: User & Time */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {post.user.avatarUrl ? (
                      <Image src={post.user.avatarUrl} alt={post.user.name} width={40} height={40} style={{ borderRadius: "50%", border: "2px solid var(--color-site-border)" }} />
                    ) : (
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-site-border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-site-white)" }}>
                        {post.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", color: "var(--color-site-white)" }}>{post.user.name}</div>
                      <div style={{ color: "var(--color-site-muted)", fontSize: "0.75rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: hu })}
                      </div>
                    </div>
                  </div>

                  {/* Badges / Tags */}
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <span style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--color-site-border)", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-site-white)" }}>
                      <Medal size={14} style={{ color: "var(--color-val-red)" }}/> {post.rank}
                    </span>
                    <span style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--color-site-border)", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-site-white)" }}>
                      <Users size={14} style={{ color: "var(--color-esport-teal)" }}/> {post.roles}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <p style={{ color: "var(--color-site-white)", fontSize: "1rem", lineHeight: 1.6, margin: "0 0 1.5rem 0", whiteSpace: "pre-wrap" }}>
                  {post.content}
                </p>

                {/* Footer Meta */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", color: "var(--color-site-muted)", fontSize: "0.875rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><MapPin size={16}/> {post.server}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: post.mic ? "var(--color-esport-teal)" : "var(--color-val-red)" }}>
                      {post.mic ? <><Mic size={16}/> Van mikrofon</> : <><MicOff size={16}/> Nincs mikrofon</>}
                    </span>
                  </div>

                  <button style={{ background: "transparent", border: "1px solid var(--color-site-border)", color: "var(--color-site-white)", padding: "0.5rem 1rem", borderRadius: "4px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", transition: "all 0.2s ease" }} className="hover:bg-site-border">
                    <MessageSquare size={16} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: "0.25rem" }}/> Kapcsolatfelvétel
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Form Container (Sticky Sidebar) */}
        <div style={{ position: "sticky", top: "2rem", alignSelf: "start" }}>
          {session ? (
            <LFGCreationForm />
          ) : (
            <div style={{ background: "rgba(255, 70, 85, 0.1)", border: "1px solid var(--color-val-red)", padding: "2rem", borderRadius: "12px", fontFamily: "var(--font-display)", fontWeight: 600, textAlign: "center", color: "var(--color-site-white)" }}>
              <MessageSquare size={32} style={{ margin: "0 auto 1rem", color: "var(--color-val-red)" }} />
              Jelentkezz be, ha szeretnél saját LFG hirdetést feladni!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
