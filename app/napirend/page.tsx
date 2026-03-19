import { getDailyTip } from "@/lib/tips";
import { getProMatches } from "@/lib/esports";
import { db } from "@/lib/db";
import { DailyPoll } from "@/components/DailyPoll";
import { MatchCountdown } from "@/components/MatchCountdown";
import { Calendar, Lightbulb, Swords } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Night Market & Események | GamerHírek",
  description: "Minden Valorant esemény, VCT meccs és Night Market dátum egy helyen. Ne maradj le a legfontosabbakról!",
  openGraph: {
    title: "Night Market & Események | GamerHírek",
    description: "Minden Valorant esemény, VCT meccs és Night Market dátum egy helyen. Ne maradj le a legfontosabbakról!",
    type: "website",
  },
};

export default async function NapirendPage() {
  const [poll, matches] = await Promise.all([
    db.poll.findFirst({
      where: { active: true },
      include: { options: { orderBy: { votes: "desc" } } },
      orderBy: { createdAt: "desc" },
    }),
    getProMatches(),
  ]);

  const upcomingMatch = matches.find((m) => m.status === "upcoming");
  const tip = getDailyTip();

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* ── HEADER ── */}
      <header style={{ marginBottom: "3rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", textAlign: "center" }}>
        <div style={{ background: "rgba(255, 70, 85, 0.1)", color: "var(--color-val-red)", padding: "0.5rem 1rem", borderRadius: "100px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <Calendar size={16} />
          Napi Betevő
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3.5rem)", textTransform: "uppercase", letterSpacing: "0.02em", margin: 0, lineHeight: 1.1 }}>
          A Gamerek <span style={{ color: "var(--color-val-red)" }}>Napirendje</span>
        </h1>
        <p style={{ color: "var(--color-site-muted)", maxWidth: "600px", fontSize: "1.125rem", margin: 0 }}>
          Minden nap új kérdés, új pro-tipp és a legfontosabb esport események egy helyen. Miért maradsz le, ha itt minden megvan?
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
        {/* ── COLUMN 1: TIP OF THE DAY ── */}
        <section
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)",
            border: "1px solid var(--color-esport-teal)",
            borderRadius: "8px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 30px -10px rgba(0, 196, 180, 0.1)"
          }}
        >
          {/* Agent background silhouette hook */}
          <div style={{ position: "absolute", bottom: "-20px", right: "-20px", fontSize: "8rem", opacity: 0.05, transform: "rotate(-15deg)", pointerEvents: "none" }}>
            <Lightbulb />
          </div>

          <div style={{ background: "var(--color-esport-teal)", color: "#000", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Lightbulb size={24} strokeWidth={2.5} />
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>Napi Valorant Tipp</h2>
          </div>
          
          <div style={{ padding: "2rem 1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ color: "var(--color-esport-teal)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
              {tip.agent} ajánlása
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", marginBottom: "1rem" }}>{tip.title}</h3>
            <p style={{ color: "var(--color-site-muted)", fontSize: "1rem", lineHeight: 1.7, margin: 0 }}>
              {tip.content}
            </p>
          </div>
        </section>

        {/* ── COLUMN 2: DAILY POLL ── */}
        <section style={{ display: "flex", flexDirection: "column" }}>
          {poll ? (
            <div style={{ height: "100%" }}>
              <DailyPoll
                pollId={poll.id}
                question={poll.question}
                options={poll.options}
              />
            </div>
          ) : (
            <div style={{ padding: "3rem", textAlign: "center", background: "var(--color-site-card)", border: "1px dashed var(--color-site-border)", borderRadius: "8px", color: "var(--color-site-muted)", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              Ma nincs aktív szavazás. Nézz vissza holnap!
            </div>
          )}
        </section>

        {/* ── COLUMN 3: VCT COUNTDOWN ── */}
        <section
          style={{
            background: "linear-gradient(135deg, rgba(255, 70, 85, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)",
            border: "1px solid var(--color-val-red)",
            borderRadius: "8px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ background: "var(--color-val-red)", color: "#fff", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Swords size={24} strokeWidth={2.5} />
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>Következő VCT Meccs</h2>
          </div>
          
          <div style={{ padding: "2rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
            {upcomingMatch ? (
             <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                  <Image src={upcomingMatch.team1.logoUrl} alt={upcomingMatch.team1.name} width={56} height={56} style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.1))" }} />
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem" }}>{upcomingMatch.team1.acronym}</span>
                </div>
                
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, color: "var(--color-site-muted)", fontSize: "1.25rem", fontStyle: "italic" }}>
                  VS
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                  <Image src={upcomingMatch.team2.logoUrl} alt={upcomingMatch.team2.name} width={56} height={56} style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.1))" }} />
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem" }}>{upcomingMatch.team2.acronym}</span>
                </div>
              </div>

              <div style={{ alignSelf: "center", marginBottom: "1rem" }}>
                <MatchCountdown match={upcomingMatch} />
              </div>
              
              <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--color-site-muted)", margin: 0 }}>
                A mérkőzést élőben követheted a VCT EMEA hivatalos Twitch csatornáin.
              </p>
             </>
            ) : (
              <div style={{ textAlign: "center", color: "var(--color-site-muted)", padding: "2rem 0" }}>
                Jelenleg nincs betervezett meccs a szezonnaptárban.
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
