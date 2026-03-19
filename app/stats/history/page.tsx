/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Activity, Target, Shield } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import Image from "next/image";


function MatchHistoryForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialName = searchParams.get("name") || "";
  const initialTag = searchParams.get("tag") || "";

  const [name, setName] = useState(initialName);
  const [tag, setTag] = useState(initialTag);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<any[]>([]);

  useEffect(() => {
    if (initialName && initialTag) {
      fetchMatches(initialName, initialTag);
    }
  }, [initialName, initialTag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tag) return;
    router.push(`/stats/history?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
  };

  const fetchMatches = async (playerName: string, playerTag: string) => {
    setLoading(true);
    setError(null);
    setMatchData([]);

    try {
      const res = await fetch(`/api/valorant/matches?name=${encodeURIComponent(playerName)}&tag=${encodeURIComponent(playerTag)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Hiba történt a lekérdezés során.");
      }

      if (!data.data || data.data.length === 0) {
        throw new Error("Nem található meccs történet ehhez a játékoshoz.");
      }

      // Process matches to find the specific player's stats
      const processedMatches = data.data.map((match: any, index: number) => {
        const targetPlayer = match.players.all_players.find(
          (p: any) => p.name.toLowerCase() === playerName.toLowerCase() && p.tag.toLowerCase() === playerTag.toLowerCase()
        );

        if (!targetPlayer) return null;

        return {
          id: match.metadata.matchid,
          map: match.metadata.map,
          agent: targetPlayer.character,
          agentIcon: targetPlayer.assets.agent.small,
          kills: targetPlayer.stats.kills,
          deaths: targetPlayer.stats.deaths,
          assists: targetPlayer.stats.assists,
          score: targetPlayer.stats.score,
          headshots: targetPlayer.stats.headshots,
          kda: ((targetPlayer.stats.kills + targetPlayer.stats.assists) / Math.max(1, targetPlayer.stats.deaths)).toFixed(2),
          matchNum: `M${data.data.length - index}`,
          team: targetPlayer.team,
          won: match.teams[targetPlayer.team.toLowerCase()]?.has_won
        };
      }).filter(Boolean).reverse(); // Reverse to get chronological order for charts

      setMatchData(processedMatches);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: "rgba(15,25,35,0.95)", border: "1px solid var(--color-site-border)", padding: "1rem", borderRadius: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Image src={data.agentIcon} alt={data.agent} width={24} height={24} style={{ borderRadius: "50%" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", color: "var(--color-site-white)" }}>{data.map}</span>
          </div>
          <div style={{ color: "var(--color-esport-teal)", fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.25rem" }}>Kills: {data.kills}</div>
          <div style={{ color: "var(--color-val-red)", fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.25rem" }}>Deaths: {data.deaths}</div>
          <div style={{ color: "var(--color-site-muted)", fontSize: "0.75rem" }}>KDA: {data.kda}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "4px", height: "2rem", background: "var(--color-esport-teal)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-esport-teal)" }}>
              Analytics
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", textTransform: "uppercase", letterSpacing: "0.02em", margin: "0" }}>
            Match <span style={{ color: "var(--color-esport-teal)" }}>History</span>
          </h1>
          <p style={{ color: "var(--color-site-muted)", fontSize: "1rem", maxWidth: "560px", margin: "0.5rem 0 0 0" }}>
            Elemezd az elmúlt 15 mérkőzés teljesítményét részletes interaktív grafikonokon.
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Játékos név"
            required
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-site-border)", color: "#fff", padding: "0.75rem 1rem", borderRadius: "4px", fontSize: "0.875rem", width: "160px" }}
          />
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="TAG (#)"
            required
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-site-border)", color: "#fff", padding: "0.75rem 1rem", borderRadius: "4px", fontSize: "0.875rem", width: "100px" }}
          />
          <button type="submit" disabled={loading} style={{ background: "var(--color-esport-teal)", color: "#000", border: "none", padding: "0 1.25rem", borderRadius: "4px", fontWeight: 700, fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "0.5rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            <Search size={16} /> Keresés
          </button>
        </form>
      </header>

      {loading && (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--color-esport-teal)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Adatok Elemzése... <Activity size={24} style={{ display: "inline", verticalAlign: "middle", marginLeft: "0.5rem", animation: "pulse 2s infinite" }} />
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(255, 70, 85, 0.1)", border: "1px solid var(--color-val-red)", color: "var(--color-val-red)", padding: "1.5rem", borderRadius: "8px", fontFamily: "var(--font-display)", fontWeight: 600, textAlign: "center", marginBottom: "2rem" }}>
          {error}
        </div>
      )}

      {matchData.length > 0 && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          
          {/* Main Chart */}
          <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", padding: "2rem", borderRadius: "12px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <Target size={24} style={{ color: "var(--color-esport-teal)" }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", textTransform: "uppercase", margin: 0 }}>Teljesítmény Trendek (K/D)</h2>
            </div>
            <div style={{ height: "400px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={matchData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorKills" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-esport-teal)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-esport-teal)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-val-red)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-val-red)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="matchNum" stroke="var(--color-site-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-site-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="kills" stroke="var(--color-esport-teal)" strokeWidth={3} fillOpacity={1} fill="url(#colorKills)" activeDot={{ r: 6, fill: "var(--color-esport-teal)", stroke: "#fff", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="deaths" stroke="var(--color-val-red)" strokeWidth={3} fillOpacity={1} fill="url(#colorDeaths)" activeDot={{ r: 6, fill: "var(--color-val-red)", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Matches List Grid */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", textTransform: "uppercase", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Shield size={20} style={{ color: "var(--color-site-muted)" }} /> Legutóbbi Mérkőzések
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
              {[...matchData].reverse().map((match) => (
                <div key={match.id} style={{
                  background: match.won ? "linear-gradient(90deg, rgba(0, 196, 180, 0.05) 0%, rgba(15,25,35,1) 100%)" : "linear-gradient(90deg, rgba(255, 70, 85, 0.05) 0%, rgba(15,25,35,1) 100%)",
                  border: "1px solid var(--color-site-border)",
                  borderLeft: `4px solid ${match.won ? "var(--color-esport-teal)" : "var(--color-val-red)"}`,
                  borderRadius: "8px",
                  padding: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <Image src={match.agentIcon} alt={match.agent} width={48} height={48} style={{ borderRadius: "50%", background: "rgba(0,0,0,0.5)" }} />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", textTransform: "uppercase", color: "var(--color-site-white)", marginBottom: "0.25rem" }}>
                      {match.map} <span style={{ color: "var(--color-site-muted)", fontSize: "0.75rem", marginLeft: "0.5rem" }}>{match.agent}</span>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", color: "var(--color-site-muted)", fontSize: "0.875rem" }}>
                      <span><span style={{ color: "var(--color-site-white)", fontWeight: 700 }}>{match.kills}</span> K</span>
                      <span><span style={{ color: "var(--color-site-white)", fontWeight: 700 }}>{match.deaths}</span> D</span>
                      <span><span style={{ color: "var(--color-site-white)", fontWeight: 700 }}>{match.assists}</span> A</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", color: match.won ? "var(--color-esport-teal)" : "var(--color-val-red)" }}>
                      {match.won ? "VICTORY" : "DEFEAT"}
                    </div>
                    <div style={{ color: "var(--color-site-muted)", fontSize: "0.75rem" }}>
                      SCORE: {match.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default function MatchHistoryPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "var(--color-esport-teal)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Betöltés...</div>}>
      <MatchHistoryForm />
    </Suspense>
  );
}
