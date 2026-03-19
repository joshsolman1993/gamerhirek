import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { calculateLevel } from "@/lib/xp";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Trophy, Activity, Calendar, Shield, MessageSquare } from "lucide-react";
import { FollowButton } from "./FollowButton";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const user = await db.user.findUnique({ where: { id: resolvedParams.id } });
  if (!user) return { title: "Nem található" };
  return {
    title: `${user.name} adatlapja | GamerHírek`,
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getSession();
  const userId = resolvedParams.id;

  const targetUser = await db.user.findUnique({
    where: { id: userId },
    include: {
      achievements: { include: { achievement: true } },
      articles: { select: { id: true } },
      _count: {
        select: {
          followers: true,
          following: true,
          comments: true,
          quizAttempts: true,
        }
      }
    },
  });

  if (!targetUser) {
    return notFound();
  }

  const { currentLevel, progress, nextThreshold } = calculateLevel(targetUser.xp);

  let isFollowing = false;
  if (session?.id) {
    const followRecord = await db.follow.findUnique({
      where: { followerId_followingId: { followerId: session.id, followingId: userId } }
    });
    isFollowing = !!followRecord;
  }

  const isSelf = session?.id === userId;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* ── HEADER ── */}
      <header style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "2rem", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "2rem", flexWrap: "wrap" }}>
        
        <div style={{ position: "relative" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "var(--color-site-card)", border: "3px solid var(--color-esport-teal)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {targetUser.avatarUrl ? (
              <Image src={targetUser.avatarUrl} alt={targetUser.name} width={120} height={120} style={{ objectFit: "cover" }} />
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
              {targetUser.name}
            </h1>
            {targetUser.role === "ADMIN" && (
              <span style={{ background: "rgba(255, 70, 85, 0.1)", color: "var(--color-val-red)", padding: "0.25rem 0.75rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid rgba(255, 70, 85, 0.3)" }}>
                Staff
              </span>
            )}
            
            {/* CTA Buttons */}
            {!isSelf && (
              <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
                <FollowButton targetUserId={userId} initialIsFollowing={isFollowing} />
                <Link href={`/chat/${userId}`} style={{
                  display: "flex", alignItems: "center", gap: "0.5rem", 
                  background: "var(--color-site-card)", color: "var(--color-site-white)", 
                  padding: "0.5rem 1rem", borderRadius: "4px", border: "1px solid var(--color-site-border)", 
                  fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase"
                }}>
                  <MessageSquare size={16} /> DM Üzenet
                </Link>
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", color: "var(--color-site-muted)", fontSize: "0.875rem", marginTop: "1rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-site-white)" }}><strong style={{ color: "var(--color-esport-teal)" }}>{targetUser._count.followers}</strong> Követő</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-site-white)" }}><strong style={{ color: "var(--color-val-red)" }}>{targetUser._count.following}</strong> Követett</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={16} /> {new Date(targetUser.createdAt).toLocaleDateString("hu-HU")}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Activity size={16} /> Kommentek: {targetUser._count.comments}</span>
          </div>
        </div>

        {/* Level Progress */}
        <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "8px", padding: "1.5rem", minWidth: "300px", width: "100%", maxWidth: "400px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-site-white)" }}>Tapasztalati pont</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--color-esport-teal)" }}>{targetUser.xp} XP</span>
          </div>
          <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "100px", overflow: "hidden", marginBottom: "0.5rem" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--color-esport-teal)", borderRadius: "100px", transition: "width 1s ease-out" }} />
          </div>
          <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--color-site-muted)" }}>
            {nextThreshold ? `${nextThreshold - targetUser.xp} XP a következő szintig` : "Maximális szint!"}
          </div>
        </div>
      </header>

      {/* ── ACHIEVEMENTS ── */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <Trophy style={{ color: "var(--color-val-red)" }} size={24} />
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", textTransform: "uppercase", margin: 0 }}>Nyilvános Kitűzők</h2>
        </div>

        {targetUser.achievements.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {targetUser.achievements.map((ua) => (
              <div key={ua.id} style={{
                background: "var(--color-site-card)",
                border: "1px solid var(--color-site-border)",
                borderRadius: "8px",
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem"
              }}>
                <div style={{ fontSize: "2rem" }}>{ua.achievement.iconUrl || "🏆"}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "white" }}>
                    {ua.achievement.name}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-site-muted)", marginBottom: "0.5rem" }}>
                    {ua.achievement.description}
                  </div>
                  <div style={{ color: "var(--color-esport-teal)", fontWeight: 700, fontSize: "0.75rem" }}>
                    +{ua.achievement.xpReward} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed var(--color-site-border)", padding: "3rem", borderRadius: "12px", textAlign: "center", color: "var(--color-site-muted)" }}>
            A felhasználó még nem ért el kitűzőket!
          </div>
        )}
      </section>
    </div>
  );
}
