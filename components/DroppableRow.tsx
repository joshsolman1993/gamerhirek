"use client";

import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface DroppableRowProps {
  id: string;
  label?: string;
  color?: string;
  children: ReactNode;
  isBank?: boolean;
}

export function DroppableRow({ id, label, color, children, isBank }: DroppableRowProps) {
  const { setNodeRef } = useDroppable({ id });

  if (isBank) {
    return (
      <div
        ref={setNodeRef}
        style={{
          width: "100%",
          minHeight: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        background: "rgba(15,25,35,0.6)",
        border: "1px solid var(--color-site-border)",
        minHeight: "80px",
      }}
    >
      <div
        style={{
          width: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "2rem",
          color: "#000",
          backgroundColor: color,
          textShadow: "1px 1px 0px rgba(255,255,255,0.3)",
          borderRight: "1px solid rgba(0,0,0,0.5)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          padding: "0.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          minHeight: "80px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
