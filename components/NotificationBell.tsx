"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { Bell, Check, ExternalLink, X } from "lucide-react";
import { getUnreadNotifications, markAsRead, markAllAsRead } from "@/actions/notifications";
import Link from "next/link";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Poll for unread notifications every 15 seconds
  const { data: notifications, mutate } = useSWR("unread-notifications", getUnreadNotifications, {
    refreshInterval: 15000,
  });

  const unreadCount = notifications?.length || 0;

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    mutate(); // Refresh the list without polling
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    mutate();
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid var(--color-site-border)",
          color: "var(--color-site-muted)",
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-site-white)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-site-muted)"}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <div style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            background: "var(--color-val-red)",
            color: "white",
            fontSize: "0.65rem",
            fontWeight: 900,
            fontFamily: "var(--font-display)",
            minWidth: "16px",
            height: "16px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            border: "2px solid var(--color-site-bg)"
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: "0.5rem",
          width: "320px",
          background: "var(--color-site-card)",
          border: "1px solid var(--color-esport-teal)",
          borderRadius: "8px",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8)",
          zIndex: 1000,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "400px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderBottom: "1px solid var(--color-site-border)", background: "rgba(0,196,180,0.05)" }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase" }}>
              Értesítések
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                style={{ background: "transparent", border: "none", color: "var(--color-site-muted)", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}
              >
                <Check size={14} /> Összes olvasása
              </button>
            )}
          </div>

          <div style={{ padding: "0", overflowY: "auto", flex: 1 }}>
            {(!notifications || unreadCount === 0) ? (
              <div style={{ padding: "2rem 1rem", textAlign: "center", color: "var(--color-site-muted)", fontSize: "0.875rem" }}>
                <Bell size={32} style={{ margin: "0 auto 0.5rem", opacity: 0.2 }} />
                Nincsenek új értesítéseid!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {notifications.map((notif: any) => (
                  <div key={notif.id} style={{ display: "flex", gap: "0.75rem", padding: "1rem", borderBottom: "1px solid var(--color-site-border)", transition: "background 0.2s ease" }} className="hover:bg-white/5">
                    <div style={{ width: "8px", height: "8px", background: "var(--color-esport-teal)", borderRadius: "50%", marginTop: "0.4rem", flexShrink: 0, boxShadow: "0 0 10px var(--color-esport-teal)" }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", lineHeight: 1.4, color: "var(--color-site-white)" }}>
                        {notif.message}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.7rem", color: "var(--color-site-muted)" }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {notif.link && (
                            <Link href={notif.link} onClick={() => { handleMarkAsRead(notif.id); setIsOpen(false); }} style={{ color: "var(--color-esport-teal)", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", textDecoration: "none" }}>
                               Megtekint <ExternalLink size={12}/>
                            </Link>
                          )}
                          <button onClick={() => handleMarkAsRead(notif.id)} style={{ background: "transparent", border: "none", color: "var(--color-site-muted)", cursor: "pointer", display: "flex", alignItems: "center" }} title="Olvasottnak jelöl">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
