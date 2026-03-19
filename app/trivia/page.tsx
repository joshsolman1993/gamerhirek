import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Brain, Trophy, CheckCircle, AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { QuizPlayer } from "./QuizPlayer";
import { getActiveQuiz } from "@/actions/trivia";

export const metadata: Metadata = {
  title: "Valorant Trivia (Napi Kvíz) | GamerHírek",
  description: "Tedd próbára a tudásodat a napi Valorant Trivia kvízekben és szerezz jutalom XP-t!",
};

export default async function TriviaPage() {
  const session = await getSession();
  const quiz = await getActiveQuiz();

  // If there's no quiz active
  if (!quiz) {
    return (
      <div style={{ margin: "0 auto", padding: "3rem 1.5rem", maxWidth: "800px", textAlign: "center" }}>
        <Brain size={48} style={{ margin: "0 auto 1.5rem", color: "var(--color-site-muted)" }} />
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2rem", textTransform: "uppercase" }}>
          Jelenleg Nincs Kvíz
        </h1>
        <p style={{ color: "var(--color-site-muted)", marginTop: "1rem" }}>
          Nézz vissza később a legújabb Valorant tudáspróbáért!
        </p>
      </div>
    );
  }

  let attempt = null;

  if (session) {
    attempt = await db.quizAttempt.findUnique({
      where: { userId_quizId: { userId: session.id, quizId: quiz.id } },
    });
  }

  return (
    <div style={{ margin: "0 auto", padding: "3rem 1.5rem" }} className="w-full max-w-4xl">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", background: "rgba(15,25,35,0.7)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--color-site-border)", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ background: "rgba(0,196,180,0.1)", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--color-esport-teal)" }}>
            <Brain size={36} style={{ color: "var(--color-esport-teal)" }} />
            </div>
            <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2.5rem", textTransform: "uppercase", margin: 0, lineHeight: 1.1 }}>
                Napi <span style={{ color: "var(--color-esport-teal)" }}>Kvíz</span>
            </h1>
            <p style={{ color: "var(--color-site-white)", fontWeight: 700, margin: "0.5rem 0 0 0", fontSize: "1.125rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {quiz.title}
                <span style={{ fontSize: "0.75rem", background: "var(--color-val-red)", padding: "0.2rem 0.5rem", borderRadius: "4px", color: "white" }}>
                Max {quiz.xpReward} XP
                </span>
            </p>
            {quiz.description && (
                <p style={{ color: "var(--color-site-muted)", margin: "0.25rem 0 0 0", fontSize: "0.875rem" }}>
                {quiz.description}
                </p>
            )}
            </div>
        </div>
      </div>

      {!session ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "12px" }}>
          <AlertCircle size={48} style={{ color: "var(--color-val-red)", margin: "0 auto 1.5rem" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", margin: "0 0 1rem 0" }}>Jelentkezz be a játékhoz!</h2>
          <p style={{ color: "var(--color-site-muted)", marginBottom: "2rem" }}>A napi kvízek kitöltéséhez és az XP jutalmak gyűjtéséhez felhasználói fiók szükséges.</p>
          <Link href="/login" style={{ display: "inline-block", background: "var(--color-val-red)", color: "white", padding: "0.75rem 2rem", borderRadius: "4px", fontWeight: 700, fontFamily: "var(--font-display)", textTransform: "uppercase" }}>
            Bejelentkezés
          </Link>
        </div>
      ) : attempt ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(66, 168, 117, 0.05)", border: "1px solid rgba(66, 168, 117, 0.3)", borderRadius: "12px" }}>
          <CheckCircle size={56} style={{ color: "#42A875", margin: "0 auto 1.5rem" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2rem", color: "#42A875", margin: "0 0 0.5rem 0" }}>Ezt már kitöltötted!</h2>
          <p style={{ color: "var(--color-site-white)", fontSize: "1.125rem", marginBottom: "2rem" }}>
            Helyes válaszok: <span style={{ fontWeight: 700, color: "var(--color-patch-gold)" }}>{attempt.score} / {attempt.maxScore}</span>
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--color-site-dark)", padding: "0.75rem 1.5rem", border: "1px solid var(--color-site-border)", borderRadius: "8px" }}>
             <Trophy size={18} style={{ color: "var(--color-esport-teal)" }}/>
             <span style={{ fontWeight: 700, color: "var(--color-site-muted)" }}>Megszerzett XP:</span>
             <span style={{ fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--color-esport-teal)", fontSize: "1.25rem" }}>+{attempt.xpAwarded}</span>
          </div>
        </div>
      ) : (
        <QuizPlayer quiz={quiz} />
      )}
    </div>
  );
}
