import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateLevel } from "@/lib/xp";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Trophy, Shield, Activity, Calendar, LogOut } from "lucide-react";
import { userLogoutAction } from "@/actions/user-auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gamer Profil | GamerHírek",
};

export default async function ProfilPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login?next=/profil");
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    include: {
      achievements: {
        include: { achievement: true },
      },
      articles: {
        select: { id: true },
      },
    },
  });

  if (!user) {
    redirect("/admin/login");
  }

  const { currentLevel, progress, nextThreshold } = calculateLevel(user.xp);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* ── HEADER ── */}
      <header style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "2rem", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "2rem", flexWrap: "wrap" }}>
        
        <div style={{ position: "relative" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "var(--color-site-card)", border: "3px solid var(--color-esport-teal)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt={user.name} width={120} height={120} style={{ objectFit: "cover" }} />
            ) : (
              <Image src="https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-b18035c4e661/displayicon.png" alt="Avatar" width={120} height={120} style={{ objectFit: "cover" }} />
            )}
          </div>
          <div style={{ position: "absolute", bottom: "-10px", left: "50%", transform: "translateX(-50%)", background: "var(--color-esport-teal)", color: "#000", padding: "0.25rem 0.75rem", borderRadius: "100px", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "0.875rem", textTransform: "uppercase", whiteSpace: "nowrap", border: "2px solid var(--color-site-bg)" }}>
            Lv. {currentLevel}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "2.5rem", textTransform: "uppercase", letterSpacing: "0.02em", margin: 0 }}>
              {user.name}
            </h1>
            {user.role === "ADMIN" && (
              <span style={{ background: "rgba(255, 70, 85, 0.1)", color: "var(--color-val-red)", padding: "0.25rem 0.75rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid rgba(255, 70, 85, 0.3)" }}>
                Staff
              </span>
            )}
            <form action={userLogoutAction} aria-label="Kijelentkezés">
              <button 
                type="submit" 
                style={{ 
                  background: "transparent", 
                  border: "1px solid var(--color-site-border)", 
                  color: "var(--color-site-muted)", 
                  padding: "0.5rem", 
                  borderRadius: "4px", 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                transition: "all 0.2s ease"
              }}
            >
              <LogOut size={14} /> Kilépés
            </button>
            </form>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", color: "var(--color-site-muted)", fontSize: "0.875rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={16} /> Regisztrált: {new Date(user.createdAt).toLocaleDateString("hu-HU")}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Activity size={16} /> Publikált cikkek: {user.articles.length}</span>
          </div>
        </div>

        {/* Level Progress */}
        <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "8px", padding: "1.5rem", minWidth: "300px", width: "100%", maxWidth: "400px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-site-white)" }}>Tapasztalati pont</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--color-esport-teal)" }}>{user.xp} XP</span>
          </div>
          <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "100px", overflow: "hidden", marginBottom: "0.5rem" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--color-esport-teal)", borderRadius: "100px", transition: "width 1s ease-out" }} />
          </div>
          <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--color-site-muted)" }}>
            {nextThreshold ? `${nextThreshold - user.xp} XP a következő szintig` : "Maximális szint!"}
          </div>
        </div>
      </header>

      {/* ── ACHIEVEMENTS ── */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <Trophy style={{ color: "var(--color-val-red)" }} size={24} />
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", textTransform: "uppercase", margin: 0 }}>Megszerzett Kitűzők</h2>
        </div>

        {user.achievements.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {user.achievements.map((ua) => (
              <div key={ua.id} style={{
                background: "linear-gradient(135deg, var(--color-site-card) 0%, rgba(15,25,35,1) 100%)",
                border: "1px solid var(--color-site-border)",
                borderRadius: "8px",
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: "100px", height: "100px", background: "radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
                
                <div style={{ fontSize: "2.5rem", textShadow: "0 0 20px rgba(255,215,0,0.5)" }}>
                  {ua.achievement.iconUrl}
                </div>
                
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", margin: "0 0 0.25rem 0", color: "#FFD700" }}>
                    {ua.achievement.name}
                  </h3>
                  <p style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", margin: 0, lineHeight: 1.4 }}>
                    {ua.achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            background: "rgba(255,255,255,0.03)", 
            border: "1px dashed var(--color-site-border)", 
            padding: "3rem", 
            borderRadius: "8px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            color: "var(--color-site-muted)"
          }}>
            <Shield size={48} opacity={0.3} />
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", margin: "0 0 0.5rem 0", color: "var(--color-site-white)" }}>Még nincsenek kitűzőid</p>
              <p style={{ margin: 0, maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
                Kommentelj híreket, vegyél részt a napi szavazáson, és látogasd az oldalt rendszeresen, hogy egyedi kitűzőket és XP-t szerezz!
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
