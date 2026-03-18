"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { PlayerStatsResult } from "@/lib/valorant-types";

// Rank tier colors and display names
const TIER_CONFIG: Record<number, { name: string; color: string; bg: string }> = {
  0:  { name: "Unranked",      color: "#8899AA", bg: "rgba(136,153,170,0.15)" },
  3:  { name: "Iron 1",        color: "#8D7B6A", bg: "rgba(141,123,106,0.15)" },
  4:  { name: "Iron 2",        color: "#8D7B6A", bg: "rgba(141,123,106,0.15)" },
  5:  { name: "Iron 3",        color: "#8D7B6A", bg: "rgba(141,123,106,0.15)" },
  6:  { name: "Bronze 1",      color: "#A0785A", bg: "rgba(160,120,90,0.15)"  },
  7:  { name: "Bronze 2",      color: "#A0785A", bg: "rgba(160,120,90,0.15)"  },
  8:  { name: "Bronze 3",      color: "#A0785A", bg: "rgba(160,120,90,0.15)"  },
  9:  { name: "Silver 1",      color: "#B0BBBF", bg: "rgba(176,187,191,0.15)" },
  10: { name: "Silver 2",      color: "#B0BBBF", bg: "rgba(176,187,191,0.15)" },
  11: { name: "Silver 3",      color: "#B0BBBF", bg: "rgba(176,187,191,0.15)" },
  12: { name: "Gold 1",        color: "#D4A843", bg: "rgba(212,168,67,0.15)"  },
  13: { name: "Gold 2",        color: "#D4A843", bg: "rgba(212,168,67,0.15)"  },
  14: { name: "Gold 3",        color: "#D4A843", bg: "rgba(212,168,67,0.15)"  },
  15: { name: "Platinum 1",    color: "#4FC4C4", bg: "rgba(79,196,196,0.15)"  },
  16: { name: "Platinum 2",    color: "#4FC4C4", bg: "rgba(79,196,196,0.15)"  },
  17: { name: "Platinum 3",    color: "#4FC4C4", bg: "rgba(79,196,196,0.15)"  },
  18: { name: "Diamond 1",     color: "#9B6ECC", bg: "rgba(155,110,204,0.15)" },
  19: { name: "Diamond 2",     color: "#9B6ECC", bg: "rgba(155,110,204,0.15)" },
  20: { name: "Diamond 3",     color: "#9B6ECC", bg: "rgba(155,110,204,0.15)" },
  21: { name: "Ascendant 1",   color: "#42A875", bg: "rgba(66,168,117,0.15)"  },
  22: { name: "Ascendant 2",   color: "#42A875", bg: "rgba(66,168,117,0.15)"  },
  23: { name: "Ascendant 3",   color: "#42A875", bg: "rgba(66,168,117,0.15)"  },
  24: { name: "Immortal 1",    color: "#EE3F41", bg: "rgba(238,63,65,0.15)"   },
  25: { name: "Immortal 2",    color: "#EE3F41", bg: "rgba(238,63,65,0.15)"   },
  26: { name: "Immortal 3",    color: "#EE3F41", bg: "rgba(238,63,65,0.15)"   },
  27: { name: "Radiant",       color: "#FDED9C", bg: "rgba(253,237,156,0.15)" },
};

function getTier(n: number) {
  return TIER_CONFIG[n] ?? TIER_CONFIG[0];
}

const REGIONS = [
  { value: "eu", label: "Europe 🇪🇺" },
  { value: "na", label: "North America 🇺🇸" },
  { value: "ap", label: "Asia Pacific 🌏" },
  { value: "kr", label: "Korea 🇰🇷" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatBox({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{
      background: "var(--color-site-card)",
      border: "1px solid var(--color-site-border)",
      padding: "1.25rem",
      textAlign: "center",
      flex: 1,
      minWidth: "100px",
    }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "2rem",
        lineHeight: 1,
        color: color ?? "var(--color-site-white)",
        marginBottom: "0.4rem",
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: "0.6875rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--color-site-muted)",
      }}>
        {label}
      </div>
    </div>
  );
}

function MatchRow({ m }: {
  m: PlayerStatsResult["computed"]["recentMatches"][0];
}) {
  const kd = m.deaths ? (m.kills / m.deaths).toFixed(2) : m.kills.toFixed(2);
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.875rem",
      padding: "0.75rem 1rem",
      borderBottom: "1px solid rgba(42,58,74,0.5)",
      background: m.won ? "rgba(66,168,117,0.04)" : "rgba(238,63,65,0.04)",
      borderLeft: `3px solid ${m.won ? "#42A875" : "#EE3F41"}`,
      transition: "background 0.2s ease",
    }}>
      {/* Agent icon */}
      <div style={{ width: "36px", height: "36px", flexShrink: 0, position: "relative", borderRadius: "2px", overflow: "hidden", background: "var(--color-site-border)" }}>
        {m.agentImg && (
          <Image src={m.agentImg} alt={m.agent} fill style={{ objectFit: "cover" }} sizes="36px" />
        )}
      </div>

      {/* Won/Lost + map */}
      <div style={{ minWidth: "80px" }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "0.875rem",
          color: m.won ? "#42A875" : "#EE3F41",
          marginBottom: "2px",
        }}>
          {m.won ? "✓ GYŐZELEM" : "✗ VERESÉG"}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--color-site-muted)" }}>{m.map}</div>
      </div>

      {/* K/D/A */}
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
        <span style={{ color: "var(--color-site-white)" }}>{m.kills}</span>
        <span style={{ color: "var(--color-site-muted)", fontSize: "0.875rem" }}>/</span>
        <span style={{ color: "#EE3F41" }}>{m.deaths}</span>
        <span style={{ color: "var(--color-site-muted)", fontSize: "0.875rem" }}>/</span>
        <span style={{ color: "var(--color-site-white)" }}>{m.assists}</span>
      </div>

      {/* KD ratio */}
      <div style={{
        marginLeft: "auto",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "1rem",
        color: Number(kd) >= 1 ? "#42A875" : "#EE3F41",
      }}>
        {kd}
      </div>

      {/* Agent name */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: "0.8125rem",
        color: "var(--color-site-muted)",
        minWidth: "70px",
        textAlign: "right",
      }}>
        {m.agent}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ValorantStatsWidget() {
  const [nameInput, setNameInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [region, setRegion] = useState("eu");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PlayerStatsResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function handleSearch(e: React.FormEvent, forceDemo = false) {
    e.preventDefault();
    if (!forceDemo && (!nameInput.trim() || !tagInput.trim())) return;
    setLoading(true);
    setError(null);
    setStats(null);

    const searchName = forceDemo ? "MajomKiraly" : nameInput.trim();
    const searchTag  = forceDemo ? "EUW"         : tagInput.trim();
    const demoParam  = forceDemo ? "&demo=true"  : "";

    try {
      const res = await fetch(
        `/api/valorant/stats?name=${encodeURIComponent(searchName)}&tag=${encodeURIComponent(searchTag)}&region=${region}${demoParam}`
      );
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Ismeretlen hiba történt.");
        return;
      }
      setStats(data);
      // Smooth scroll to results
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch {
      setError("Hálózati hiba. Ellenőrizd az internetkapcsolatod!");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo(e: React.MouseEvent) {
    e.preventDefault();
    await handleSearch({ preventDefault: () => {} } as React.FormEvent, true);
  }

  const tier = stats?.mmr?.current_data ? getTier(stats.mmr.current_data.currenttier) : null;
  const rankImg = stats?.mmr?.current_data?.images?.large;

  return (
    <div>
      {/* ─── Search form ─── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,70,85,0.06) 0%, rgba(15,25,35,0) 60%)",
        border: "1px solid var(--color-site-border)",
        borderTop: "3px solid var(--color-val-red)",
        padding: "2.5rem",
        marginBottom: "2rem",
      }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "0.875rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-site-muted)",
          marginBottom: "1.75rem",
        }}>
          Add meg a Valorant profiled adatait
        </p>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          {/* Name */}
          <div style={{ flex: "2 1 180px" }}>
            <label htmlFor="val-name" style={{ display: "block", fontSize: "0.6875rem", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-site-muted)", marginBottom: "0.5rem" }}>
              Játékosnév
            </label>
            <input
              id="val-name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="MajomKiraly"
              required
              className="admin-input"
              style={{ fontSize: "1.0625rem" }}
            />
          </div>

          {/* Tag */}
          <div style={{ flex: "1 1 100px" }}>
            <label htmlFor="val-tag" style={{ display: "block", fontSize: "0.6875rem", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-site-muted)", marginBottom: "0.5rem" }}>
              Tag
            </label>
            <input
              id="val-tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="EUW"
              required
              className="admin-input"
              style={{ fontSize: "1.0625rem" }}
            />
          </div>

          {/* Region */}
          <div style={{ flex: "1 1 120px" }}>
            <label htmlFor="val-region" style={{ display: "block", fontSize: "0.6875rem", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-site-muted)", marginBottom: "0.5rem" }}>
              Szerver
            </label>
            <select
              id="val-region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="admin-input"
              style={{ cursor: "pointer" }}
            >
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="admin-btn-primary"
            style={{ flex: "0 0 auto", height: "46px", padding: "0 1.75rem", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }} />
                Keresés...
              </span>
            ) : "🔍 Keresés"}
          </button>
        </form>

        <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--color-site-muted)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <span>Formátum: <code style={{ color: "var(--color-esport-teal)", background: "rgba(0,196,180,0.08)", padding: "1px 5px" }}>Játékosnév#TAG</code> — pl. MajomKiraly#EUW</span>
          <button
            type="button"
            onClick={handleDemo}
            disabled={loading}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.6875rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-esport-teal)",
              border: "1px solid rgba(0,196,180,0.4)",
              background: "rgba(0,196,180,0.08)",
              padding: "0.25rem 0.625rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            🎮 Demo betöltése
          </button>
        </p>
      </div>

      {/* ─── Error state ─── */}
      {error && (
        <div style={{
          background: "rgba(255,70,85,0.08)",
          border: "1px solid rgba(255,70,85,0.3)",
          borderLeft: "4px solid var(--color-val-red)",
          padding: "1.25rem 1.5rem",
          marginBottom: "2rem",
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
        }}>
          <span style={{ fontSize: "1.25rem" }}>⚠️</span>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.25rem" }}>Hiba</div>
            <div style={{ fontSize: "0.875rem", color: "rgba(236,232,225,0.75)" }}>{error}</div>
          </div>
        </div>
      )}

      {/* ─── Results ─── */}
      {stats && (
        <div ref={resultsRef} style={{ animation: "fadeSlideUp 0.4s ease forwards" }}>

          {/* Profile header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "1.5rem",
            background: "var(--color-site-card)",
            border: "1px solid var(--color-site-border)",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            alignItems: "center",
          }}
          className="stats-profile-grid">
            {/* Player card image */}
            <div style={{ position: "relative", width: "160px", height: "80px", overflow: "hidden", border: "1px solid var(--color-site-border)", flexShrink: 0 }}>
              {stats.account.card?.wide ? (
                <Image src={stats.account.card.wide} alt="Player Card" fill style={{ objectFit: "cover" }} sizes="160px" />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "var(--color-site-dark)" }} />
              )}
            </div>

            {/* Name + level + rank */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.875rem",
                  margin: 0,
                  lineHeight: 1,
                }}>
                  {stats.account.name}
                  <span style={{ color: "var(--color-site-muted)", fontWeight: 400 }}>#{stats.account.tag}</span>
                </h2>
                <span style={{
                  background: "var(--color-site-dark)",
                  border: "1px solid var(--color-site-border)",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  padding: "0.2rem 0.5rem",
                }}>
                  LVL {stats.account.level}
                </span>
              </div>

              {/* Title */}
              {stats.account.title && (
                <p style={{ fontSize: "0.875rem", color: "var(--color-esport-teal)", marginBottom: "0.625rem", fontStyle: "italic" }}>
                  „{stats.account.title}"
                </p>
              )}

              {/* Rank display */}
              {tier && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  {rankImg && (
                    <div style={{ position: "relative", width: "48px", height: "48px" }}>
                      <Image src={rankImg} alt={tier.name} fill style={{ objectFit: "contain" }} sizes="48px" />
                    </div>
                  )}
                  <div>
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1.375rem",
                      color: tier.color,
                      lineHeight: 1,
                    }}>
                      {stats.mmr.current_data.currenttierpatched || tier.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-site-muted)", marginTop: "2px" }}>
                      {stats.mmr.current_data.ranking_in_tier} RR
                      {stats.mmr.current_data.mmr_change_to_last_game !== 0 && (
                        <span style={{ marginLeft: "0.5rem", color: stats.mmr.current_data.mmr_change_to_last_game > 0 ? "#42A875" : "#EE3F41", fontWeight: 700 }}>
                          {stats.mmr.current_data.mmr_change_to_last_game > 0 ? "+" : ""}{stats.mmr.current_data.mmr_change_to_last_game}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Highest rank ever */}
                  {stats.mmr.highest_rank?.patched_tier && (
                    <div style={{
                      marginLeft: "auto",
                      background: tier.bg,
                      border: `1px solid ${tier.color}33`,
                      padding: "0.375rem 0.75rem",
                    }}>
                      <div style={{ fontSize: "0.6875rem", color: "var(--color-site-muted)", fontFamily: "var(--font-display)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Legjobb rank
                      </div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", color: tier.color }}>
                        {stats.mmr.highest_rank.patched_tier}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ─── Stats row ─── */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <StatBox
              label="K/D arány"
              value={stats.computed.kd}
              color={stats.computed.kd >= 1.2 ? "#42A875" : stats.computed.kd < 0.8 ? "#EE3F41" : "var(--color-site-white)"}
            />
            <StatBox
              label="Win Rate"
              value={`${stats.computed.winRate}%`}
              color={stats.computed.winRate >= 55 ? "#42A875" : stats.computed.winRate < 45 ? "#EE3F41" : "var(--color-site-white)"}
            />
            <StatBox
              label="Avg. Score"
              value={stats.computed.avgScore}
              color="var(--color-patch-gold)"
            />
            <StatBox
              label="HS%"
              value={`${stats.computed.headshotPct}%`}
              color={stats.computed.headshotPct >= 25 ? "#42A875" : "var(--color-site-muted)"}
            />
          </div>

          {/* ─── Top agents + Recent matches ─── */}
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem" }} className="stats-bottom-grid">

            {/* Top agents */}
            <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)" }}>
              <div style={{ padding: "0.875rem 1.125rem", borderBottom: "1px solid var(--color-site-border)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                  Legjobb Ágensek
                </h3>
              </div>
              {stats.computed.topAgents.length === 0 ? (
                <p style={{ padding: "1.5rem", color: "var(--color-site-muted)", fontSize: "0.875rem" }}>Nincs mérkőzés adat.</p>
              ) : (
                stats.computed.topAgents.map((agent, i) => (
                  <div key={agent.name} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.875rem 1.125rem",
                    borderBottom: i < stats.computed.topAgents.length - 1 ? "1px solid rgba(42,58,74,0.5)" : "none",
                  }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-site-muted)", width: "16px", fontSize: "0.875rem" }}>
                      #{i + 1}
                    </span>
                    <div style={{ position: "relative", width: "40px", height: "40px", border: "1px solid var(--color-site-border)", borderRadius: "2px", overflow: "hidden", flexShrink: 0 }}>
                      {agent.img && <Image src={agent.img} alt={agent.name} fill style={{ objectFit: "cover" }} sizes="40px" />}
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem" }}>{agent.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-site-muted)" }}>
                        {agent.games} meccs · {Math.round((agent.wins / agent.games) * 100)}% WR · {agent.kd} KD
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Recent matches */}
            <div style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)" }}>
              <div style={{ padding: "0.875rem 1.125rem", borderBottom: "1px solid var(--color-site-border)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                  Legutóbbi Mérkőzések
                </h3>
              </div>
              {stats.computed.recentMatches.length === 0 ? (
                <p style={{ padding: "1.5rem", color: "var(--color-site-muted)", fontSize: "0.875rem" }}>Nincs mérkőzés adat.</p>
              ) : (
                stats.computed.recentMatches.map((m) => (
                  <MatchRow key={m.id} m={m} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
