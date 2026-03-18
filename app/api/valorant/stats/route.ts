import { NextResponse } from "next/server";
import type {
  PlayerStatsResult,
  ValorantAccount,
  ValorantMMR,
  ValorantMatch,
  MatchPlayer,
} from "@/lib/valorant-types";

const HENRIK_BASE = "https://api.henrikdev.gg";

async function hGet<T>(path: string): Promise<{ data: T; status: number }> {
  const apiKey = process.env.HENRIK_API_KEY ?? "";
  
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(apiKey ? { Authorization: apiKey } : {}),
  };

  const res = await fetch(`${HENRIK_BASE}${path}`, {
    headers,
    next: { revalidate: 120 },
  });

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Non-JSON response (status: ${res.status})`);
  }

  const json = await res.json();
  return { data: json.data ?? json, status: json.status ?? res.status };
}

// ─── Demo mock data ────────────────────────────────────────────────────────────
function buildDemoResponse(name: string, tag: string): PlayerStatsResult {
  return {
    account: {
      name,
      tag,
      puuid: "demo-puuid",
      region: "eu",
      card: {
        small: "https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-818035c4e561/displayicon.png",
        large: "https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-818035c4e561/largeart.png",
        wide:  "https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-818035c4e561/wideart.png",
        id:    "9fb348bc-41a0-91ad-8a3e-818035c4e561",
      },
      title: "A Diamond Rizikó",
      level: 247,
    },
    mmr: {
      name,
      tag,
      current_data: {
        currenttier: 19,
        currenttierpatched: "Diamond 2",
        ranking_in_tier: 48,
        mmr_change_to_last_game: 18,
        elo: 1948,
        images: {
          small: "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/smallicon.png",
          large: "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/largeicon.png",
          triangle_down: "",
          triangle_up:   "",
        },
      },
      highest_rank: {
        patched_tier: "Immortal 1",
        tier: 24,
        season: "e9a2",
      },
      mmr_history: [],
    },
    matches: [],
    computed: {
      kd: 1.38,
      winRate: 57,
      avgScore: 264,
      headshotPct: 23,
      topAgents: [
        { name: "Jett",  games: 52, wins: 31, kd: 1.72, img: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayiconsmall.png" },
        { name: "Clove", games: 38, wins: 22, kd: 1.41, img: "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayiconsmall.png" },
        { name: "Fade",  games: 21, wins: 11, kd: 1.09, img: "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayiconsmall.png" },
      ],
      recentMatches: [
        { id: "1", map: "Ascent",  mode: "Competitive", won: true,  kills: 24, deaths: 15, assists: 4, agent: "Jett",  agentImg: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayiconsmall.png", mmrChange: 18, rounWins: 13, roundTotal: 23 },
        { id: "2", map: "Breeze",  mode: "Competitive", won: false, kills: 14, deaths: 18, assists: 3, agent: "Clove", agentImg: "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayiconsmall.png", mmrChange: -12, rounWins: 9, roundTotal: 22 },
        { id: "3", map: "Sunset",  mode: "Competitive", won: true,  kills: 31, deaths: 19, assists: 7, agent: "Jett",  agentImg: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayiconsmall.png", mmrChange: 22, rounWins: 13, roundTotal: 24 },
        { id: "4", map: "Abyss",   mode: "Competitive", won: true,  kills: 19, deaths: 14, assists: 5, agent: "Fade",  agentImg: "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayiconsmall.png", mmrChange: 15, rounWins: 13, roundTotal: 22 },
        { id: "5", map: "Icebox",  mode: "Competitive", won: false, kills: 12, deaths: 16, assists: 2, agent: "Jett",  agentImg: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayiconsmall.png", mmrChange: -10, rounWins: 8, roundTotal: 21 },
      ],
    },
  };
}

// ─── Main handler ──────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name   = searchParams.get("name")?.trim();
  const tag    = searchParams.get("tag")?.trim();
  const region = searchParams.get("region")?.trim() ?? "eu";
  const demo   = searchParams.get("demo") === "true";

  if (!name || !tag) {
    return NextResponse.json({ error: "Name and tag are required" }, { status: 400 });
  }

  // ── Demo / development mode ──
  if (demo) {
    return NextResponse.json(buildDemoResponse(name, tag));
  }

  try {
    const [accountRes, mmrRes, matchesRes] = await Promise.all([
      hGet<ValorantAccount>(`/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`),
      hGet<ValorantMMR>(`/valorant/v2/mmr/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`),
      hGet<ValorantMatch[]>(`/valorant/v3/matches/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?size=10&mode=competitive`),
    ]);

    if (accountRes.status !== 200 && accountRes.status !== 1) {
      return NextResponse.json(
        { error: "Játékos nem található. Ellenőrizd a nevet és a taget!" },
        { status: 404 }
      );
    }

    const account = accountRes.data as ValorantAccount;
    const mmr     = mmrRes.data as ValorantMMR;
    const matches = (Array.isArray(matchesRes.data) ? matchesRes.data : []) as ValorantMatch[];

    // Compute aggregated stats
    const playerMatches = matches
      .map((m) => {
        const player = m.players?.all_players?.find(
          (p: MatchPlayer) =>
            p.name.toLowerCase() === name.toLowerCase() &&
            p.tag.toLowerCase()  === tag.toLowerCase()
        );
        const isBlue = player?.team?.toLowerCase() === "blue";
        const won = isBlue ? m.teams?.blue?.has_won : m.teams?.red?.has_won;
        return { match: m, player, won };
      })
      .filter((m) => m.player);

    let totalKills = 0, totalDeaths = 0;
    let totalHead  = 0, totalBody   = 0, totalLeg     = 0;
    let totalScore = 0, wins = 0;
    const agentMap: Record<string, { games: number; wins: number; kills: number; deaths: number; img: string }> = {};

    playerMatches.forEach(({ player, won }) => {
      if (!player) return;
      const s = player.stats;
      totalKills   += s.kills;
      totalDeaths  += s.deaths;
      totalHead    += s.shots?.head ?? 0;
      totalBody    += s.shots?.body ?? 0;
      totalLeg     += s.shots?.leg  ?? 0;
      totalScore   += s.score;
      if (won) wins++;

      const agentName = player.character;
      if (!agentMap[agentName]) {
        agentMap[agentName] = { games: 0, wins: 0, kills: 0, deaths: 0, img: player.assets?.agent?.small ?? "" };
      }
      agentMap[agentName].games++;
      agentMap[agentName].kills  += s.kills;
      agentMap[agentName].deaths += s.deaths;
      if (won) agentMap[agentName].wins++;
    });

    const totalShots  = totalHead + totalBody + totalLeg;
    const gamesPlayed = playerMatches.length;

    const computed: PlayerStatsResult["computed"] = {
      kd:           totalDeaths ? Math.round((totalKills  / totalDeaths)  * 100) / 100 : totalKills,
      winRate:      gamesPlayed ? Math.round((wins        / gamesPlayed)  * 100) : 0,
      avgScore:     gamesPlayed ? Math.round( totalScore  / gamesPlayed)         : 0,
      headshotPct:  totalShots  ? Math.round((totalHead   / totalShots)   * 100) : 0,
      topAgents: Object.entries(agentMap)
        .sort(([, a], [, b]) => b.games - a.games)
        .slice(0, 3)
        .map(([agentName, d]) => ({
          name:  agentName,
          games: d.games,
          wins:  d.wins,
          kd:    d.deaths ? Math.round((d.kills / d.deaths) * 100) / 100 : d.kills,
          img:   d.img,
        })),
      recentMatches: playerMatches.slice(0, 5).map(({ match, player, won }) => ({
        id:         match.metadata?.matchid ?? "",
        map:        match.metadata?.map     ?? "Unknown",
        mode:       match.metadata?.mode    ?? "Competitive",
        won:        Boolean(won),
        kills:      player!.stats.kills,
        deaths:     player!.stats.deaths,
        assists:    player!.stats.assists,
        agent:      player!.character,
        agentImg:   player!.assets?.agent?.small ?? "",
        mmrChange:  0,
        rounWins:   won ? match.teams.blue.rounds_won : match.teams.red.rounds_won,
        roundTotal: (match.teams.blue.rounds_won ?? 0) + (match.teams.red.rounds_won ?? 0),
      })),
    };

    return NextResponse.json({ account, mmr, matches, computed } satisfies PlayerStatsResult);
  } catch (err) {
    console.error("[Valorant Stats API Error]", err);
    const isNetworkErr = err instanceof TypeError && (err.message.includes("fetch") || err.message.includes("ENOTFOUND"));
    return NextResponse.json(
      {
        error: isNetworkErr
          ? "Az API szerver hálózati szinten nem érhető el. Próbáld meg később vagy használd a Demo adatokat!"
          : "Az API jelenleg nem elérhető, próbáld újra!",
      },
      { status: 503 }
    );
  }
}
