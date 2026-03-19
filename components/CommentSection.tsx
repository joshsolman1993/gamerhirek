"use client";

import { useState, useTransition, useRef } from "react";
import { addComment } from "@/actions/community";
import { toggleCommentUpvote } from "@/actions/social";
import { ThumbsUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
  userId?: string | null;
  userAvatar?: string | null;
  upvotesC?: number;
  isUpvoted?: boolean;
}

interface CommentSectionProps {
  articleId: string;
  initialComments: Comment[];
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return "Most";
  if (secs < 3600) return `${Math.floor(secs / 60)} perce`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} órája`;
  return `${Math.floor(secs / 86400)} napja`;
}

export function CommentSection({ articleId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const authorName = formData.get("authorName") as string;
    const content = formData.get("content") as string;

    startTransition(async () => {
      const result = await addComment(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      // Optimistic update
      setComments((prev) => [
        {
          id: Math.random().toString(),
          authorName,
          content,
          createdAt: new Date(),
          upvotesC: 0,
          isUpvoted: false
        },
        ...prev,
      ]);
      setSuccess(true);
      formRef.current?.reset();
    });
  }

  return (
    <section style={{ marginTop: "3rem" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "2rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid var(--color-site-border)",
      }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "1.375rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          margin: 0,
        }}>
          Hozzászólások
        </h2>
        {comments.length > 0 && (
          <span style={{
            background: "var(--color-val-red)",
            color: "white",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.75rem",
            padding: "0.2rem 0.5rem",
            minWidth: "24px",
            textAlign: "center",
          }}>
            {comments.length}
          </span>
        )}
      </div>

      {/* Comment form */}
      <div style={{
        background: "var(--color-site-card)",
        border: "1px solid var(--color-site-border)",
        borderLeft: "3px solid var(--color-val-red)",
        padding: "1.5rem",
        marginBottom: "2rem",
      }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "0.875rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-site-muted)",
          marginBottom: "1.25rem",
        }}>
          Szólj hozzá!
        </p>

        <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="hidden" name="articleId" value={articleId} />
          {/* Honeypot */}
          <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="comment-form-grid">
            <div>
              <label htmlFor="authorName" style={{ display: "block", fontSize: "0.75rem", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-site-muted)", marginBottom: "0.375rem" }}>
                Becenév *
              </label>
              <input id="authorName" name="authorName" required minLength={2} maxLength={50} className="admin-input" placeholder="Gamer123" />
            </div>
            <div>
              <label htmlFor="authorEmail" style={{ display: "block", fontSize: "0.75rem", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-site-muted)", marginBottom: "0.375rem" }}>
                E-mail (opcionális)
              </label>
              <input id="authorEmail" name="authorEmail" type="email" className="admin-input" placeholder="email@pelda.hu" />
            </div>
          </div>

          <div>
            <label htmlFor="comment-content" style={{ display: "block", fontSize: "0.75rem", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-site-muted)", marginBottom: "0.375rem" }}>
              Hozzászólás *
            </label>
            <textarea
              id="comment-content"
              name="content"
              required
              minLength={3}
              maxLength={1000}
              rows={4}
              className="admin-input"
              placeholder="Írd le a véleményed..."
              style={{ resize: "vertical" }}
            />
          </div>

          {error && (
            <div style={{ background: "rgba(255,70,85,0.1)", border: "1px solid rgba(255,70,85,0.3)", padding: "0.625rem 0.875rem", color: "var(--color-val-red)", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: "rgba(0,196,180,0.1)", border: "1px solid rgba(0,196,180,0.3)", padding: "0.625rem 0.875rem", color: "var(--color-esport-teal)", fontSize: "0.875rem" }}>
              ✓ Hozzászólásod megjelent!
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="admin-btn-primary"
            style={{ alignSelf: "flex-start", opacity: isPending ? 0.7 : 1 }}
          >
            {isPending ? "Küldés..." : "Küldés"}
          </button>
        </form>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p style={{ color: "var(--color-site-muted)", textAlign: "center", padding: "2rem 0", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
          Még nincs hozzászólás. Légy az első!
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                background: "var(--color-site-card)",
                border: "1px solid var(--color-site-border)",
                padding: "1.125rem 1.25rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  {comment.userId ? (
                    <Link href={`/profil/${comment.userId}`} style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden",
                        background: "var(--color-site-border)", flexShrink: 0,
                      }}>
                        {comment.userAvatar ? (
                           <Image src={comment.userAvatar} alt={comment.authorName} width={32} height={32} style={{ objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "var(--color-val-red)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem" }}>
                            {comment.authorName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-site-white)" }}>
                        {comment.authorName}
                      </span>
                    </Link>
                  ) : (
                    <>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden",
                        background: "var(--color-val-red)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem",
                        color: "white", flexShrink: 0,
                      }}>
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-site-white)" }}>
                        {comment.authorName}
                      </span>
                    </>
                  )}
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-site-muted)" }}>
                  {timeAgo(comment.createdAt)}
                </span>
              </div>
              <p style={{ color: "rgba(236,232,225,0.85)", lineHeight: 1.6, margin: 0, fontSize: "0.9375rem", marginBottom: "1rem" }}>
                {comment.content}
              </p>
              
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={async () => {
                    await toggleCommentUpvote(comment.id);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    color: comment.isUpvoted ? "var(--color-esport-teal)" : "var(--color-site-muted)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    transition: "color 0.2s ease"
                  }}
                >
                  <ThumbsUp size={16} fill={comment.isUpvoted ? "currentColor" : "none"} />
                  {comment.upvotesC || 0} Kudos
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
