"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import useSWR from "swr";
import { Send, AlertCircle, ShieldAlert } from "lucide-react";
import { getChatMessages, sendChatMessage } from "@/actions/chat";
import Image from "next/image";

export function LiveChat({ currentUser }: { currentUser: { id: string; name: string; avatarUrl?: string | null; role: string; level: number } | null }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const { data, error, mutate } = useSWR("chat-messages", () => getChatMessages(50), {
    refreshInterval: 3000,
  });

  // Keep local messages updated from SWR
  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(formData: FormData) {
    const text = formData.get("content")?.toString();
    if (!text || text.trim().length === 0) return;
    
    // Optimistic UI update
    const optimisticMsg = {
      id: "temp-" + Date.now(),
      content: text,
      createdAt: new Date(),
      isSpecial: currentUser?.role === "ADMIN" && text.startsWith("/shout "),
      user: currentUser,
    };
    
    if (optimisticMsg.isSpecial) {
        optimisticMsg.content = optimisticMsg.content.replace("/shout ", "");
    }

    setMessages((prev) => [...prev, optimisticMsg]);
    // Scroll intentionally after optimistic append
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 50);

    const formElement = document.getElementById("chat-form") as HTMLFormElement;
    if (formElement) formElement.reset(); // clear input visually instantly

    startTransition(async () => {
      const res = await sendChatMessage(text);
      if (res?.error) {
        // Revert UI on error
        setMessages(data || []);
        alert(res.error);
      } else {
        mutate();
      }
    });
  }

  // Generate fancy rank badge colors depending on level
  const getLevelColor = (level: number) => {
      if (level >= 50) return "var(--color-patch-gold)";
      if (level >= 25) return "var(--color-val-red)";
      if (level >= 10) return "var(--color-esport-teal)";
      return "var(--color-site-muted)";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", background: "var(--color-site-card)", border: "1px solid var(--color-site-border)", borderRadius: "8px", overflow: "hidden" }}>
      {/* Messages Window */}
      <div 
        ref={chatContainerRef}
        style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {!data && !error && (
          <div style={{ margin: "auto", color: "var(--color-site-muted)" }}>Csatlakozás a Globál Kocsmához...</div>
        )}
        
        {messages.map((m) => {
          const isMe = currentUser?.id === m.user?.id;
          return (
            <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", opacity: m.id.toString().startsWith("temp-") ? 0.7 : 1 }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end", flexDirection: isMe ? "row-reverse" : "row", maxWidth: "80%" }}>
                {/* Avatar */}
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-site-dark)", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                   {m.user?.avatarUrl ? (
                     <Image src={m.user.avatarUrl} alt="avatar" fill style={{ objectFit: "cover" }} />
                   ) : (
                     <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-site-muted)", fontSize: "0.75rem", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                        {m.user?.name.substring(0, 2).toUpperCase()}
                     </div>
                   )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: isMe ? "flex-end" : "flex-start" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.75rem", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                    <span style={{ color: getLevelColor(m.user?.level || 1) }}>LVL {m.user?.level || 1}</span>
                    <span style={{ color: isMe ? "var(--color-esport-teal)" : "var(--color-site-white)" }}>
                      {m.user?.name}
                    </span>
                    {m.user?.role === "ADMIN" && (
                        <span style={{ color: "var(--color-val-red)", background: "rgba(238,63,65,0.1)", padding: "0.1rem 0.3rem", borderRadius: "2px", fontSize: "0.65rem" }}>
                            ADMIN
                        </span>
                    )}
                  </div>

                  <div style={{ 
                      background: m.isSpecial ? "rgba(238,63,65,0.1)" : isMe ? "rgba(0,196,180,0.15)" : "rgba(255,255,255,0.05)",
                      border: m.isSpecial ? "1px solid var(--color-val-red)" : isMe ? "1px solid var(--color-esport-teal)" : "1px solid var(--color-site-border)",
                      padding: "0.75rem 1rem",
                      borderRadius: isMe ? "12px 12px 0 12px" : "12px 12px 12px 0",
                      color: m.isSpecial ? "var(--color-val-red)" : "var(--color-site-white)",
                      fontSize: "0.9375rem",
                      lineHeight: 1.5,
                      wordBreak: "break-word"
                   }}>
                      {m.isSpecial && <ShieldAlert size={16} style={{ display: "inline", marginRight: "0.5rem", verticalAlign: "bottom" }} />}
                      {m.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div style={{ padding: "1.25rem", borderTop: "1px solid var(--color-site-border)", background: "var(--color-site-dark)" }}>
        {currentUser ? (
          <form id="chat-form" action={handleSend} style={{ display: "flex", gap: "1rem" }}>
            <input 
              name="content"
              type="text" 
              placeholder={currentUser.role === "ADMIN" ? "Írj üzenetet... (vagy /shout egy hirdetéshez)" : "Szólj hozzá a beszélgetéshez..."}
              maxLength={300}
              required
              disabled={isPending}
              autoComplete="off"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--color-site-border)",
                padding: "0.75rem 1rem",
                borderRadius: "4px",
                color: "var(--color-site-white)",
                outline: "none",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--color-esport-teal)"}
              onBlur={(e) => e.target.style.borderColor = "var(--color-site-border)"}
            />
            <button 
                type="submit" 
                disabled={isPending}
                style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    padding: "0 1.5rem", 
                    background: "var(--color-esport-teal)", 
                    color: "var(--color-site-dark)", 
                    border: "none", 
                    borderRadius: "4px", 
                    cursor: "pointer",
                    fontWeight: 700,
                    opacity: isPending ? 0.7 : 1,
                    transition: "opacity 0.2s ease"
                }}
            >
              <Send size={18} />
            </button>
          </form>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-site-muted)", padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "4px", border: "1px solid var(--color-site-border)" }}>
            <AlertCircle size={18} style={{ color: "var(--color-val-red)" }}/>
            <span style={{ fontSize: "0.875rem" }}>A chateléshez be kell jelentkezned!</span>
          </div>
        )}
      </div>
    </div>
  );
}
