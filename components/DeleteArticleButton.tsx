"use client";

import { deleteArticle } from "@/actions/articles";
import { useTransition } from "react";

interface DeleteArticleButtonProps {
  id: string;
  fullWidth?: boolean;
}

export function DeleteArticleButton({ id, fullWidth }: DeleteArticleButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Biztosan törlöd ezt a cikket?")) return;
    startTransition(async () => {
      await deleteArticle(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="admin-btn-danger"
      style={{
        padding: fullWidth ? "0.625rem 1rem" : "0.25rem 0.75rem",
        fontSize: fullWidth ? "0.9375rem" : "0.75rem",
        width: fullWidth ? "100%" : undefined,
        textAlign: fullWidth ? "center" : undefined,
        opacity: isPending ? 0.6 : 1,
        cursor: isPending ? "not-allowed" : "pointer",
      }}
    >
      {isPending ? "Törlés..." : "Cikk törlése"}
    </button>
  );
}
