"use client";

import { deleteQuiz } from "@/actions/admin";
import { useState } from "react";

export function DeleteQuizButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        if (!confirm("Biztosan törlöd a Kvízt? (Minden kapcsolódó kérdés és kitöltés végleg elvész!)")) return;
        setLoading(true);
        await deleteQuiz(id);
        setLoading(false);
      }}
      disabled={loading}
      style={{
        background: "var(--color-val-red)",
        color: "white",
        border: "none",
        padding: "0.5rem 1rem",
        fontSize: "0.85rem",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        textTransform: "uppercase",
        cursor: "pointer",
        borderRadius: "4px",
        opacity: loading ? 0.7 : 1,
      }}
    >
      Törlés
    </button>
  );
}
