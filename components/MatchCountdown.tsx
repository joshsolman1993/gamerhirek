"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/lib/esports";

export function MatchCountdown({ match }: { match: Match }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const target = new Date(match.startTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setIsLive(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [match.startTime]);

  if (isLive) {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
        background: "rgba(255, 70, 85, 0.1)",
        color: "var(--color-val-red)",
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        border: "1px solid rgba(255, 70, 85, 0.3)",
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", letterSpacing: "0.1em",
        animation: "pulse 2s infinite"
      }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-val-red)" }} />
        LIVE MOST
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", gap: "1rem", alignItems: "center",
      background: "var(--color-site-card)",
      padding: "1rem 1.5rem",
      border: "1px solid var(--color-site-border)",
      color: "var(--color-site-white)",
      fontFamily: "var(--font-display)",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>{String(timeLeft.days).padStart(2, "0")}</div>
        <div style={{ fontSize: "0.6875rem", color: "var(--color-site-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>NAP</div>
      </div>
      <div style={{ fontSize: "1.5rem", color: "var(--color-site-muted)", fontWeight: 300 }}>:</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>{String(timeLeft.hours).padStart(2, "0")}</div>
        <div style={{ fontSize: "0.6875rem", color: "var(--color-site-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>ÓRA</div>
      </div>
      <div style={{ fontSize: "1.5rem", color: "var(--color-site-muted)", fontWeight: 300 }}>:</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1 }}>{String(timeLeft.minutes).padStart(2, "0")}</div>
        <div style={{ fontSize: "0.6875rem", color: "var(--color-site-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>PERC</div>
      </div>
      <div style={{ fontSize: "1.5rem", color: "var(--color-site-muted)", fontWeight: 300 }}>:</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1, color: "var(--color-esport-teal)" }}>{String(timeLeft.seconds).padStart(2, "0")}</div>
        <div style={{ fontSize: "0.6875rem", color: "var(--color-esport-teal)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>MP</div>
      </div>
    </div>
  );
}
