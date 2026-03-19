"use client";

import { useState } from "react";
import { deleteComment, deleteGlobalChat } from "@/actions/admin";

export function ModerationActions({ id, type }: { id: string; type: "CHAT" | "COMMENT" }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Biztosan törölni szeretnéd véglegesen?")) return;
    setLoading(true);
    if (type === "CHAT") {
      await deleteGlobalChat(id);
    } else {
      await deleteComment(id);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        background: "var(--color-val-red)",
        color: "white",
        border: "none",
        padding: "0.25rem 0.6rem",
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
