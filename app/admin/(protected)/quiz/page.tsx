import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { CreateQuizForm } from "./CreateQuizForm";
import { DeleteQuizButton } from "./DeleteQuizButton";

export const dynamic = "force-dynamic";

export default async function AdminQuizPage() {
  const quizzes = await db.quiz.findMany({
    orderBy: { createdAt: "desc" },
    include: { questions: { include: { options: true } }, _count: { select: { attempts: true } } },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.75rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "0.25rem",
            }}
          >
            Napi Kvízek
          </h1>
          <p style={{ color: "var(--color-site-muted)" }}>
            Hozz létre új kvízeket. Minden beállított kvíz azonnal aktív.
          </p>
        </div>
        <CreateQuizForm />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
        {quizzes.map((quiz) => (
          <div key={quiz.id} style={{ background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "4px", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.5rem" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--color-site-white)", textTransform: "uppercase" }}>
                  {quiz.title}
                </h3>
                <span style={{ background: "var(--color-esport-teal)", color: "var(--color-site-bg)", padding: "0.1rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                  {quiz.xpReward} XP
                </span>
                <span style={{ color: "var(--color-site-muted)", fontSize: "0.85rem" }}>
                  {formatDate(quiz.createdAt)}
                </span>
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--color-site-muted)" }}>
                {quiz.description || "Nincs leírás"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-val-red)", marginTop: "0.5rem", fontWeight: 700 }}>
                {quiz.questions.length} kérdés • {quiz._count.attempts} kitöltés
              </div>
            </div>
            
            <DeleteQuizButton id={quiz.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
