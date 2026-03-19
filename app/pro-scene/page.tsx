import Image from "next/image";
import Link from "next/link";
import { getProMatches, getStandings, getTeams } from "@/lib/esports";
import { MatchCountdown } from "@/components/MatchCountdown";
import { ArrowRight, Trophy } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profi Színtér | GamerHírek",
  description: "Kövessd a VCT EMEA, Masters és Champions tornákat. E-sport eredmények, interjúk és Pick'em tippjáték.",
  openGraph: {
    title: "Profi Színtér | GamerHírek",
    description: "Kövessd a VCT EMEA, Masters és Champions tornákat. E-sport eredmények, interjúk és Pick'em tippjáték.",
    type: "website",
  },
};

export default async function ProScenePage() {
  const [matches, standings, teams] = await Promise.all([
    getProMatches(),
    getStandings(),
    getTeams(),
  ]);

  const upcomingMatch = matches.find((m) => m.status === "upcoming");
  const pastMatches = matches.filter((m) => m.status === "completed").reverse();

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* ── HERO BANNER ── */}
      <section
        style={{
          position: "relative",
          marginBottom: "3rem",
          borderRadius: "8px",
          overflow: "hidden",
          background: "linear-gradient(135deg, rgba(14,21,37,1) 0%, rgba(30,41,59,1) 100%)",
          border: "1px solid var(--color-site-border)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop') center/cover",
            opacity: 0.1,
            mixBlendMode: "overlay",
          }}
        />
        
        <div style={{ position: "relative", padding: "3rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "2rem" }}>
          <div>
            <div style={{ color: "var(--color-esport-teal)", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.2em", fontSize: "0.875rem", marginBottom: "1rem", textTransform: "uppercase" }}>
              Valorant Champions Tour 2026
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2.5rem, 5vw, 4rem)", textTransform: "uppercase", letterSpacing: "0.02em", margin: "0 0 1rem 0", lineHeight: 1.1 }}>
              EMEA <br/><span style={{ color: "var(--color-val-red)" }}>KICKOFF</span>
            </h1>
            <p style={{ color: "var(--color-site-muted)", maxWidth: "500px", fontSize: "1.125rem", lineHeight: 1.6 }}>
              A legjobb európai csapatok küzdenek a kijutásért. Kövesd a meccseket élőben, böngészd a tabellát és ismerd meg a legjobb játékosokat.
            </p>
          </div>

          {upcomingMatch && (
            <div style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem", borderRadius: "8px", width: "100%", maxWidth: "450px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-site-muted)" }}>Következő mérkőzés</span>
                <span style={{ fontSize: "0.75rem", color: "var(--color-esport-teal)", fontWeight: 600 }}>BO3</span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                  <Image src={upcomingMatch.team1.logoUrl} alt={upcomingMatch.team1.name} width={64} height={64} style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))" }} />
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem" }}>{upcomingMatch.team1.acronym}</span>
                </div>
                
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, color: "var(--color-site-muted)", fontSize: "1.5rem", fontStyle: "italic" }}>
                  VS
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                  <Image src={upcomingMatch.team2.logoUrl} alt={upcomingMatch.team2.name} width={64} height={64} style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))" }} />
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem" }}>{upcomingMatch.team2.acronym}</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <MatchCountdown match={upcomingMatch} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── TWO COLUMN LAYOUT ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "3rem", marginBottom: "4rem" }}>
        {/* Left: Matches */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "1rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", textTransform: "uppercase", margin: 0 }}>Legutóbbi Eredmények</h2>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {pastMatches.map((match) => (
              <div
                key={match.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--color-site-card)",
                  border: "1px solid var(--color-site-border)",
                  padding: "1rem 1.5rem",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                  cursor: "pointer",
                }}
                className="match-row"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                  <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-site-bg)", borderRadius: "50%" }}>
                    <Image src={match.team1.logoUrl} alt={match.team1.name} width={24} height={24} style={{ objectFit: "contain" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: match.score1 > match.score2 ? 700 : 400, color: match.score1 > match.score2 ? "var(--color-site-white)" : "var(--color-site-muted)" }}>{match.team1.name}</span>
                </div>

                <div style={{ padding: "0.5rem 1rem", background: "var(--color-site-bg)", display: "flex", gap: "1rem", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", border: "1px solid var(--color-site-border)" }}>
                  <span style={{ color: match.score1 > match.score2 ? "var(--color-val-red)" : "var(--color-site-white)" }}>{match.score1}</span>
                  <span style={{ color: "var(--color-site-muted)", fontWeight: 300 }}>-</span>
                  <span style={{ color: match.score2 > match.score1 ? "var(--color-val-red)" : "var(--color-site-white)" }}>{match.score2}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, justifyContent: "flex-end" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: match.score2 > match.score1 ? 700 : 400, color: match.score2 > match.score1 ? "var(--color-site-white)" : "var(--color-site-muted)" }}>{match.team2.name}</span>
                  <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-site-bg)", borderRadius: "50%" }}>
                    <Image src={match.team2.logoUrl} alt={match.team2.name} width={24} height={24} style={{ objectFit: "contain" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!pastMatches.length && <p style={{ color: "var(--color-site-muted)" }}>Nem található befejezett mérkőzés.</p>}
        </section>

        {/* Right: Standings */}
        <aside>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--color-val-red)", paddingBottom: "1rem" }}>
            <Trophy style={{ color: "var(--color-val-red)" }} size={24} />
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", textTransform: "uppercase", margin: 0 }}>Tabella</h2>
            <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--color-site-muted)", textTransform: "uppercase", fontFamily: "var(--font-display)" }}>Omega</span>
          </div>
          
          <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "30px 1fr 40px 40px", padding: "1rem", borderBottom: "1px solid var(--color-site-border)", color: "var(--color-site-muted)", fontSize: "0.75rem", fontFamily: "var(--font-display)", fontWeight: 600 }}>
              <div>#</div>
              <div>CSAPAT</div>
              <div style={{ textAlign: "center" }}>W-L</div>
              <div style={{ textAlign: "center" }}>+/-</div>
            </div>

            {standings.map((s, idx) => (
              <div
                key={s.teamId}
                style={{
                  display: "grid",
                  gridTemplateColumns: "30px 1fr 40px 40px",
                  padding: "1rem",
                  borderBottom: idx === standings.length - 1 ? "none" : "1px solid var(--color-site-border)",
                  alignItems: "center",
                  background: idx < 2 ? "linear-gradient(90deg, rgba(255, 70, 85, 0.05) 0%, transparent 100%)" : "transparent"
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: idx < 2 ? "var(--color-val-red)" : "var(--color-site-muted)" }}>
                  {idx + 1}.
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Image src={s.team.logoUrl} alt={s.team.name} width={20} height={20} style={{ objectFit: "contain" }} />
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.875rem" }}>{s.team.acronym}</span>
                </div>
                <div style={{ textAlign: "center", fontFamily: "var(--font-display)", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--color-site-white)" }}>{s.wins}</span><span style={{ color: "var(--color-site-muted)" }}>-</span><span>{s.losses}</span>
                </div>
                <div style={{ textAlign: "center", fontFamily: "var(--font-display)", fontSize: "0.875rem", color: s.roundDiff > 0 ? "var(--color-esport-teal)" : (s.roundDiff < 0 ? "var(--color-val-red)" : "var(--color-site-muted)") }}>
                  {s.roundDiff > 0 ? "+" : ""}{s.roundDiff}
                </div>
              </div>
            ))}
            
            <div style={{ padding: "0.75rem 1rem", background: "var(--color-site-bg)", borderTop: "1px solid var(--color-site-border)", fontSize: "0.75rem", color: "var(--color-site-muted)", display: "flex", justifyContent: "space-between" }}>
              <span>Top 2 továbbjut a Playoffsba.</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ── TEAMS GRID ── */}
      <section>
         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "1px solid var(--color-site-border)", paddingBottom: "1rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", textTransform: "uppercase", margin: 0 }}>Résztvevő Csapatok</h2>
            <Link href="/kategoria/esport" style={{ color: "var(--color-val-red)", fontFamily: "var(--font-display)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem", textTransform: "uppercase" }}>
              Esport hírfolyam <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {teams.map((team) => (
              <div
                key={team.id}
                style={{
                  background: "var(--color-site-card)",
                  border: "1px solid var(--color-site-border)",
                  borderTop: `3px solid ${team.color}`,
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
                className="team-card hover-lift"
              >
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", position: "relative" }}>
                   <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `radial-gradient(circle at center, ${team.color}20 0%, transparent 70%)`, pointerEvents: "none" }} />
                   
                   <Image src={team.logoUrl} alt={team.name} width={80} height={80} style={{ objectFit: "contain", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))", position: "relative", zIndex: 1 }} />
                   <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em", position: "relative", zIndex: 1 }}>{team.name}</h3>
                </div>
                
                <div style={{ background: "var(--color-site-bg)", padding: "1rem", borderTop: "1px solid var(--color-site-border)" }}>
                  <div style={{ color: "var(--color-site-muted)", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem", fontFamily: "var(--font-display)" }}>Roster</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {team.roster.map(r => (
                      <span key={r.handle} style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", padding: "0.25rem 0.5rem", fontSize: "0.8125rem", borderRadius: "4px" }}>
                        {r.handle}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
      </section>

      {/* Global styles for this page interactions */}
      <style dangerouslySetInnerHTML={{__html: `
        .match-row:hover {
          border-color: var(--color-site-text) !important;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        }
      `}} />
    </div>
  );
}
