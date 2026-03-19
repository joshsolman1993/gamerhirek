"use client";

import { useState, useTransition } from "react";
import { submitQuizAttempt } from "@/actions/trivia";
import { ChevronRight, Target, Play } from "lucide-react";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function QuizPlayer({ quiz }: { quiz: any }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const handleStart = () => setCurrentStep(0);

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentStep < quiz.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const currentQuestion = quiz.questions[currentStep];

  const handleSubmit = async () => {
    startTransition(async () => {
      const res = await submitQuizAttempt(quiz.id, answers);
      if (res?.error) {
        alert(res.error);
      }
      // Success will triggering revalidatePath, reloading the server component to show the Results screen.
    });
  };

  if (currentStep === -1) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--color-site-card)", border: "1px solid var(--color-esport-teal)", borderRadius: "12px", boxShadow: "0 10px 30px -10px rgba(0,196,180,0.2)" }}>
        <Target size={64} style={{ color: "var(--color-esport-teal)", margin: "0 auto 1.5rem" }} />
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2rem", textTransform: "uppercase", marginBottom: "1rem" }}>
          Készen Állsz?
        </h2>
        <p style={{ color: "var(--color-site-muted)", maxWidth: "500px", margin: "0 auto 2rem", fontSize: "1.125rem" }}>
          Válaszold meg mind a {quiz.questions.length} kérdést a legjobb tudásod szerint. 
          A megszerzett XP azonnal jóváíródik a profilodon!
        </p>
        <button
          onClick={handleStart}
          style={{
            background: "var(--color-esport-teal)",
            color: "var(--color-site-dark)",
            border: "none",
            padding: "1rem 3rem",
            fontSize: "1.125rem",
            fontWeight: 700,
            textTransform: "uppercase",
            fontFamily: "var(--font-display)",
            cursor: "pointer",
            borderRadius: "4px",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "transform 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <Play fill="currentColor" size={20} /> Kezdés
        </button>
      </div>
    );
  }

  const isLast = currentStep === quiz.questions.length - 1;
  const hasAnsweredCurrent = !!answers[currentQuestion.id];

  return (
    <div style={{ padding: "2rem", background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-site-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Kérdés {currentStep + 1} / {quiz.questions.length}
        </span>
        <div style={{ display: "flex", gap: "0.25rem", flex: 1, maxWidth: "200px", marginLeft: "2rem" }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {quiz.questions.map((_: any, idx: number) => (
            <div 
              key={idx} 
              style={{ 
                height: "6px", 
                flex: 1, 
                background: idx <= currentStep ? "var(--color-esport-teal)" : "rgba(255,255,255,0.1)",
                borderRadius: "3px" 
              }} 
            />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", marginBottom: "1.5rem", lineHeight: 1.4 }}>
          {currentQuestion.text}
        </h3>

        {currentQuestion.imageUrl && (
          <div style={{ width: "100%", height: "250px", position: "relative", marginBottom: "2rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--color-site-border)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentQuestion.imageUrl} alt="Kérdéshez kapcsolódó kép" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {currentQuestion.options.map((opt: any) => {
             const isSelected = answers[currentQuestion.id] === opt.id;
             return (
               <button
                 key={opt.id}
                 onClick={() => handleSelect(currentQuestion.id, opt.id)}
                 style={{
                   width: "100%",
                   textAlign: "left",
                   padding: "1rem 1.25rem",
                   background: isSelected ? "rgba(0,196,180,0.1)" : "rgba(255,255,255,0.03)",
                   border: isSelected ? "1px solid var(--color-esport-teal)" : "1px solid var(--color-site-border)",
                   borderLeft: isSelected ? "4px solid var(--color-esport-teal)" : "4px solid transparent",
                   color: isSelected ? "var(--color-esport-teal)" : "var(--color-site-white)",
                   borderRadius: "4px",
                   fontSize: "1rem",
                   cursor: "pointer",
                   transition: "all 0.15s ease",
                   fontFamily: "var(--font-sans)",
                 }}
               >
                 {opt.text}
               </button>
             );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={!hasAnsweredCurrent || isPending}
            style={{
              background: "var(--color-val-red)",
              color: "white",
              border: "none",
              padding: "0.875rem 2rem",
              borderRadius: "4px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "uppercase",
              cursor: (!hasAnsweredCurrent || isPending) ? "not-allowed" : "pointer",
              opacity: (!hasAnsweredCurrent || isPending) ? 0.5 : 1,
              transition: "opacity 0.2s ease"
            }}
          >
            {isPending ? "Értékelés..." : "Kvíz Befejezése"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!hasAnsweredCurrent}
            style={{
              background: "var(--color-esport-teal)",
              color: "var(--color-site-dark)",
              border: "none",
              padding: "0.875rem 2rem",
              borderRadius: "4px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: !hasAnsweredCurrent ? "not-allowed" : "pointer",
              opacity: !hasAnsweredCurrent ? 0.5 : 1,
              transition: "opacity 0.2s ease"
            }}
          >
            Következő <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
