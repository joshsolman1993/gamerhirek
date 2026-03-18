"use client";

import { useState, useTransition } from "react";
import { votePoll } from "@/actions/community";

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface DailyPollProps {
  question: string;
  options: PollOption[];
  pollId: string;
}

const STORAGE_KEY = "gamerhirek_voted_polls";

function getVoted(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); } catch { return {}; }
}

export function DailyPoll({ question, options, pollId }: DailyPollProps) {
  const [voted, setVoted] = useState<Record<string, string>>(getVoted);
  const [localOptions, setLocalOptions] = useState(options);
  const [isPending, startTransition] = useTransition();

  const myVote = voted[pollId];
  const totalVotes = localOptions.reduce((s, o) => s + o.votes, 0);
  const hasVoted = Boolean(myVote);

  function handleVote(optionId: string) {
    if (hasVoted || isPending) return;

    const newVoted = { ...voted, [pollId]: optionId };
    setVoted(newVoted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVoted));

    // Optimistic update
    setLocalOptions((prev) =>
      prev.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o))
    );

    startTransition(() => { votePoll(optionId); });
  }

  return (
    <div style={{
      background: "var(--color-site-card)",
      border: "1px solid var(--color-site-border)",
      borderTop: "3px solid var(--color-esport-teal)",
    }}>
      {/* Header */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--color-site-border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ color: "var(--color-esport-teal)", fontSize: "0.75rem" }}>●</span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-esport-teal)" }}>
          Napi Kérdés
        </span>
      </div>

      <div style={{ padding: "1.25rem" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.0625rem", lineHeight: 1.3, marginBottom: "1rem" }}>
          {question}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {localOptions.map((option) => {
            const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            const isMyVote = myVote === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={hasVoted || isPending}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  border: `1px solid ${isMyVote ? "var(--color-esport-teal)" : "var(--color-site-border)"}`,
                  background: "var(--color-site-dark)",
                  padding: "0.625rem 0.875rem",
                  textAlign: "left",
                  cursor: hasVoted ? "default" : "pointer",
                  transition: "border-color 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                }}
              >
                {/* Progress bar background */}
                {hasVoted && (
                  <div style={{
                    position: "absolute",
                    left: 0, top: 0, bottom: 0,
                    width: `${pct}%`,
                    background: isMyVote ? "rgba(0,196,180,0.12)" : "rgba(255,255,255,0.04)",
                    transition: "width 0.6s ease",
                  }} />
                )}

                <span style={{
                  position: "relative",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: isMyVote ? "var(--color-esport-teal)" : "var(--color-site-white)",
                }}>
                  {isMyVote && "✓ "}{option.label}
                </span>

                {hasVoted && (
                  <span style={{
                    position: "relative",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: isMyVote ? "var(--color-esport-teal)" : "var(--color-site-muted)",
                    flexShrink: 0,
                  }}>
                    {pct}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p style={{ fontSize: "0.75rem", color: "var(--color-site-muted)", marginTop: "0.75rem", textAlign: "right" }}>
          {totalVotes} szavazat
        </p>
      </div>
    </div>
  );
}
