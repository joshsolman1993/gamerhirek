import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { Users, UserPlus, Gamepad2, ShieldCheck, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Közösségi Hub | GamerHírek",
  description: "Találj új játékostársakat, kövesd barátaidat és csatlakozz klánokhoz a GamerHírek platformján.",
};

export default async function CommunityHubPage() {
  const session = await getSession();

  // If not logged in, we just show top users
  type HubUser = { id: string, name: string, avatarUrl: string | null, xp: number, role: string };
  let suggestedUsers: HubUser[] = [];
  let followingUsers: HubUser[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let feed: any[] = [];

  if (session?.id) {
    // 1. Akiket követ
    const followingRecs = await db.follow.findMany({
      where: { followerId: session.id },
      include: {
        following: {
          select: { id: true, name: true, avatarUrl: true, xp: true, role: true }
        }
      }
    });
    followingUsers = followingRecs.map(r => r.following);

    const followingIds = followingUsers.map(u => u.id);
    followingIds.push(session.id); // add self to exclude

    // 2. Ajánlott játékosok (Nem követettek, magas XP-vel)
    suggestedUsers = await db.user.findMany({
      where: {
        id: { notIn: followingIds }
      },
      orderBy: { xp: "desc" },
      take: 5,
      select: { id: true, name: true, avatarUrl: true, xp: true, role: true }
    });

    // 3. Feed (követettek utolsó tettei - kommentek)
    const recentComments = await db.comment.findMany({
      where: {
        userId: { in: followingUsers.map(u => u.id) }
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        article: { select: { id: true, title: true, slug: true } }
      }
    });
    feed = recentComments;

  } else {
    // Guest view
    suggestedUsers = await db.user.findMany({
      orderBy: { xp: "desc" },
      take: 8,
      select: { id: true, name: true, avatarUrl: true, xp: true, role: true }
    });
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <header style={{ marginBottom: "3rem", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "2.5rem", textTransform: "uppercase", margin: 0, color: "var(--color-site-white)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Users color="var(--color-esport-teal)" size={36} />
          Közösségi Hub
        </h1>
        <p style={{ color: "var(--color-site-muted)", margin: "0.5rem 0 0 0" }}>
          Találj új csapattársakat, nézd meg barátaid aktivitását és csatlakozz Valorant klánokhoz.
        </p>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <Link href="/guilds" className="admin-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={18} /> Klánok Böngészése
          </Link>
          {session?.id && (
            <Link href="/profil" className="admin-btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Gamepad2 size={18} /> Saját Profil
            </Link>
          )}
        </div>
      </header>


      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem" }}>
        
        {/* Bal Oldal - Tevékenység / Feed */}
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", textTransform: "uppercase", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MessageSquare color="var(--color-patch-gold)" size={24} /> 
            Ismerősök Aktivitása
          </h2>

          {!session ? (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed var(--color-site-border)", padding: "3rem", borderRadius: "12px", textAlign: "center", color: "var(--color-site-muted)" }}>
              Jelentkezz be, hogy lásd kiket követsz és mit csinálnak az oldalon!
            </div>
          ) : feed.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed var(--color-site-border)", padding: "3rem", borderRadius: "12px", textAlign: "center", color: "var(--color-site-muted)" }}>
              Még nincsenek friss hírek a barátaidtól. Kövess be több felhasználót az ajánlások közül!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {feed.map((action, i) => (
                <div key={i} style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "12px", padding: "1.5rem", display: "flex", gap: "1rem" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-site-border)", flexShrink: 0, overflow: "hidden" }}>
                    {action.user.avatarUrl ? (
                       <Image src={action.user.avatarUrl} alt={action.user.name} width={40} height={40} style={{ objectFit: "cover" }} />
                    ) : (
                       <div style={{ width: "100%", height: "100%", background: "var(--color-val-red)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 700 }}>{action.user.name.charAt(0)}</div>
                    )}
                  </div>
                  <div>
                    <div style={{ marginBottom: "0.25rem" }}>
                      <Link href={`/profil/${action.user.id}`} style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-site-white)", textDecoration: "none" }}>{action.user.name}</Link>
                      <span style={{ color: "var(--color-site-muted)", fontSize: "0.875rem", margin: "0 0.5rem" }}>hozzászólt ehhez:</span>
                      <Link href={`/hirek/${action.article.slug}`} style={{ color: "var(--color-esport-teal)", fontWeight: 500, textDecoration: "none" }}>{action.article.title}</Link>
                    </div>
                    <div style={{ color: "rgba(236,232,225,0.85)", fontSize: "0.9375rem", fontStyle: "italic", borderLeft: "2px solid var(--color-site-border)", paddingLeft: "0.75rem", marginTop: "0.5rem" }}>
                      &quot;{action.content}&quot;
                    </div>
                    <div style={{ color: "var(--color-site-muted)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                      {action.createdAt.toLocaleString("hu-HU", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Jobb Oldal - Ajánlások */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div style={{ background: "linear-gradient(180deg, var(--color-site-card) 0%, rgba(15,25,35,1) 100%)", border: "1px solid var(--color-esport-teal)", borderRadius: "12px", padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", margin: "0 0 1.5rem 0", color: "var(--color-site-white)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <UserPlus color="var(--color-esport-teal)" size={20} /> Játékos Ajánló
            </h3>
            
            {suggestedUsers.length === 0 ? (
              <p style={{ color: "var(--color-site-muted)", fontSize: "0.875rem" }}>Jelenleg nincs új ajánlásunk.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {suggestedUsers.map(user => (
                  <div key={user.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <Link href={`/profil/${user.id}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", overflow: "hidden" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-site-border)", overflow: "hidden", flexShrink: 0 }}>
                        {user.avatarUrl && <Image src={user.avatarUrl} alt={user.name} width={40} height={40} style={{ objectFit: "cover" }} />}
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-site-white)", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                          {user.name}
                        </div>
                        <div style={{ color: "var(--color-esport-teal)", fontSize: "0.75rem", fontWeight: 700 }}>
                          {user.xp} XP
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {session?.id && followingUsers.length > 0 && (
            <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "12px", padding: "1.5rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", margin: "0 0 1.5rem 0", color: "var(--color-site-white)", textTransform: "uppercase" }}>
                Követted Játékosok
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {followingUsers.map(u => (
                  <Link key={u.id} href={`/profil/${u.id}`} title={u.name}>
                     <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid var(--color-esport-teal)", overflow: "hidden" }}>
                       {u.avatarUrl ? (
                          <Image src={u.avatarUrl} alt={u.name} width={36} height={36} style={{ objectFit: "cover" }} />
                       ) : (
                          <div style={{ width: "100%", height: "100%", background: "var(--color-site-bg)" }} />
                       )}
                     </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </aside>
      </div>

    </div>
  );
}
