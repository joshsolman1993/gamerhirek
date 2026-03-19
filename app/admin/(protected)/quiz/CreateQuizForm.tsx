"use client";

import { useState } from "react";
import { createQuiz } from "@/actions/admin";

export function CreateQuizForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [xpReward, setXpReward] = useState("100");

  const [questions, setQuestions] = useState([{
    text: "",
    imageUrl: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false }
    ]
  }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      text: "", imageUrl: "", options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }]
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createQuiz({
      title,
      description,
      xpReward: parseInt(xpReward) || 0,
      questions
    });
    setLoading(false);
    setOpen(false);
    // Reset defaults loosely
    setTitle("");
    setDescription("");
  };

  if (!open) {
    return (
      <button className="admin-btn-primary" onClick={() => setOpen(true)}>
        + Új Kvíz Létrehozása
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.8)",
      zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "var(--color-site-card)",
        border: "1px solid var(--color-esport-teal)",
        padding: "2rem",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflowY: "auto"
      }}>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-site-white)", marginTop: 0, textTransform: "uppercase" }}>Új Gamification Kvíz</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <input required placeholder="Kvíz Címe (pl. Valorant Map Trivia)" value={title} onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "0.5rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white" }} />
          
          <textarea placeholder="Rövid leírás (opcionális)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
            style={{ padding: "0.5rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white" }} />
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label style={{ color: "var(--color-site-muted)", fontSize: "0.85rem", fontWeight: 700 }}>XP JUTALOM:</label>
            <input required type="number" value={xpReward} onChange={(e) => setXpReward(e.target.value)}
              style={{ width: "100px", padding: "0.5rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white" }} />
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,0.05)" }} />
          <h3 style={{ color: "var(--color-site-white)", fontSize: "1rem", marginTop: 0 }}>Kérdések összeállítása:</h3>

          {questions.map((q, qIndex) => (
            <div key={qIndex} style={{ padding: "1rem", background: "rgba(0,0,0,0.5)", border: "1px dashed var(--color-site-muted)" }}>
              <div style={{ fontWeight: 700, color: "var(--color-val-red)", marginBottom: "0.5rem" }}>{qIndex + 1}. Kérdés</div>
              <input required placeholder="Kérdés szövege..." value={q.text} onChange={(e) => {
                const newQs = [...questions];
                newQs[qIndex].text = e.target.value;
                setQuestions(newQs);
              }} style={{ width: "100%", padding: "0.5rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white", marginBottom: "0.5rem" }} />
              
              <input placeholder="Kép URL (opcionális)..." value={q.imageUrl || ""} onChange={(e) => {
                const newQs = [...questions];
                newQs[qIndex].imageUrl = e.target.value;
                setQuestions(newQs);
              }} style={{ width: "100%", padding: "0.5rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white", marginBottom: "1rem" }} />

              <div style={{ fontSize: "0.75rem", color: "var(--color-esport-teal)", marginBottom: "0.5rem", fontWeight: 700 }}>Sikeres (Helyes) opciók:</div>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <input required placeholder="Válasz..." value={opt.text} onChange={(e) => {
                    const newQs = [...questions];
                    newQs[qIndex].options[oIndex].text = e.target.value;
                    setQuestions(newQs);
                  }} style={{ flex: 1, padding: "0.3rem", background: "var(--color-site-bg)", border: "1px solid var(--color-site-border)", color: "white" }} />
                  
                  <select value={opt.isCorrect ? "true" : "false"} onChange={(e) => {
                    const newQs = [...questions];
                    newQs[qIndex].options[oIndex].isCorrect = e.target.value === "true";
                    setQuestions(newQs);
                  }} style={{ background: "var(--color-site-bg)", color: "white", border: "1px solid var(--color-site-border)", padding: "0.3rem" }}>
                    <option value="true">Helyes (+)</option>
                    <option value="false">Hamis (-)</option>
                  </select>

                  <button type="button" onClick={() => {
                     const newQs = [...questions];
                     newQs[qIndex].options.push({ text: "", isCorrect: false });
                     setQuestions(newQs);
                  }} style={{ background: "transparent", color: "white", border: "1px solid var(--color-site-border)", cursor: "pointer", padding: "0 0.5rem" }}>+</button>
                </div>
              ))}
            </div>
          ))}

          <button type="button" onClick={handleAddQuestion} style={{ padding: "0.5rem", background: "var(--color-site-bg)", border: "1px dashed var(--color-esport-teal)", color: "var(--color-esport-teal)", cursor: "pointer", fontWeight: 700 }}>+ Új Kérdés Hozzáadása</button>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="submit" disabled={loading} className="admin-btn-primary" style={{ flex: 1, textAlign: "center", opacity: loading ? 0.5 : 1 }}>Mentés és Kiírás</button>
            <button type="button" disabled={loading} onClick={() => setOpen(false)} className="admin-btn-secondary" style={{ padding: "0 2rem" }}>Mégse</button>
          </div>
        </form>
      </div>
    </div>
  );
}
