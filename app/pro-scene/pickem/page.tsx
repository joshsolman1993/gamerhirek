import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PickemMatchList } from "@/components/PickemMatchList";
import { Coins } from "lucide-react";

async function ensureSeedMatches() {
  const existing = await db.match.count();
  if (existing === 0) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    await db.match.createMany({
      data: [
        { teamA: "FNATIC", teamB: "NAVI", startTime: tomorrow, format: "BO3", teamALogo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Esports_organization_Fnatic_logo.svg/1200px-Esports_organization_Fnatic_logo.svg.png", teamBLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Natus_Vincere_logo.svg/1200px-Natus_Vincere_logo.svg.png" },
        { teamA: "LOUD", teamB: "NRG", startTime: dayAfter, format: "BO3", teamALogo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/LOUD_logo.png", teamBLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/NRG_Esports_logo.svg/1200px-NRG_Esports_logo.svg.png" },
        { teamA: "PAPER REX", teamB: "DRX", startTime: tomorrow, format: "BO5", teamALogo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Paper_Rex_logo.svg/1200px-Paper_Rex_logo.svg.png", teamBLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/DRX_logo.svg/1200px-DRX_logo.svg.png" }
      ]
    });
  }
}

export default async function PickemPage() {
  const session = await getSession();
  
  // Try seeding dummy scheduled matches if db is empty (for demo purposes)
  await ensureSeedMatches();

  const matches = await db.match.findMany({
    orderBy: { startTime: "asc" }
  });

  // Get user predictions if logged in
  let userPredictions: Record<string, string> = {};
  if (session) {
    const rawPredictions = await db.prediction.findMany({
      where: { userId: session.id }
    });
    userPredictions = rawPredictions.reduce((acc: Record<string, string>, p: { matchId: string; predictedWinner: string }) => {
      acc[p.matchId] = p.predictedWinner;
      return acc;
    }, {} as Record<string, string>);
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "4px", height: "2rem", background: "var(--color-esport-teal)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-esport-teal)" }}>
              Esports Fantasy
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", textTransform: "uppercase", letterSpacing: "0.02em", margin: "0" }}>
            VCT <span style={{ color: "var(--color-esport-teal)" }}>Pick&apos;em</span>
          </h1>
          <p style={{ color: "var(--color-site-muted)", fontSize: "1rem", maxWidth: "560px", margin: "0.5rem 0 0 0" }}>
            Jósold meg a közelgő Valorant profi meccsek eredményeit! A helyes találatokért Gamification XP-t és prémium kitűzőket szerezhetsz.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid var(--color-esport-teal)", padding: "1rem 1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ background: "rgba(0,196,180,0.1)", borderRadius: "50%", padding: "0.75rem", color: "var(--color-esport-teal)" }}>
              <Coins size={24} />
            </div>
            <div>
              <div style={{ color: "var(--color-site-muted)", fontSize: "0.75rem", fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Helyes Tipp</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", color: "var(--color-esport-teal)" }}>+50 XP</div>
            </div>
          </div>
        </div>
      </header>

      {!session && (
        <div style={{ background: "rgba(255, 70, 85, 0.1)", border: "1px solid var(--color-val-red)", padding: "1.5rem", borderRadius: "8px", fontFamily: "var(--font-display)", fontWeight: 600, textAlign: "center", marginBottom: "3rem", color: "var(--color-site-white)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
          Nincs aktív munkamenet! Jelentkezz be, hogy leadhasd a tippjeidet és versenyezz a többiekkel.
        </div>
      )}

      {/* Matches Grid using a Client Component for Interactivity */}
      <PickemMatchList matches={matches} userPredictions={userPredictions} />
      
    </div>
  );
}
