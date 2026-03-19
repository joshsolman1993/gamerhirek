"use client";

import { useState } from "react";
import { deleteCategory } from "@/actions/admin";

export function DeleteCategoryButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        if (!confirm("Biztosan törlöd? Hibát okozhat, ha már vannak cikkek ezen a kategórián!")) return;
        setLoading(true);
        await deleteCategory(id);
        setLoading(false);
      }}
      disabled={loading}
      style={{
        background: "transparent",
        color: "var(--color-val-red)",
        border: "1px solid var(--color-val-red)",
        padding: "0.25rem 0.5rem",
        fontSize: "0.75rem",
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
