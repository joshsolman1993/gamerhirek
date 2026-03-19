"use client";

import { useState } from "react";
import { sendDirectMessage } from "@/actions/social";
import { SendIcon, Loader2 } from "lucide-react";

export function ChatInput({ receiverId }: { receiverId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    const result = await sendDirectMessage(receiverId, content);
    setLoading(false);

    if (result.error) {
      alert(result.error);
    } else {
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Írj üzenetet..."
        style={{
          flex: 1,
          background: "var(--color-site-card)",
          border: "1px solid var(--color-site-border)",
          color: "var(--color-site-white)",
          padding: "0.75rem 1rem",
          borderRadius: "100px",
          outline: "none",
        }}
        disabled={loading}
      />
      <button
        type="submit"
        disabled={!content.trim() || loading}
        style={{
          background: "var(--color-esport-teal)",
          color: "#000",
          border: "none",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          opacity: (!content.trim() || loading) ? 0.5 : 1,
          transition: "transform 0.2s ease"
        }}
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <SendIcon size={20} />}
      </button>
    </form>
  );
}
