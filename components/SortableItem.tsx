"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ValorantAgent } from "@/lib/agents";
import Image from "next/image";

export function SortableItem({ id, agent }: { id: string; agent: ValorantAgent }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: "grab",
    userSelect: "none" as const,
    position: "relative" as const,
    border: "2px solid rgba(255,255,255,0.1)",
    borderRadius: "2px",
    background: "var(--color-site-bg)",
    width: "80px",
    height: "80px",
    overflow: "hidden",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Image 
        src={agent.imageUrl} 
        alt={agent.name} 
        fill 
        sizes="80px"
        style={{ objectFit: "cover", pointerEvents: "none" }} 
      />
      <div 
        style={{ 
          position: "absolute", 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: "linear-gradient(transparent, rgba(0,0,0,0.8))", 
          fontSize: "0.625rem", 
          textAlign: "center", 
          fontFamily: "var(--font-display)", 
          fontWeight: 700, 
          paddingBottom: "2px" 
        }}
      >
        {agent.name}
      </div>
    </div>
  );
}
