"use client";

import { useState } from "react";
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor, TouchSensor, type DragStartEvent, type DragOverEvent, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { DroppableRow } from "./DroppableRow";
import { AGENTS, TIER_ROWS, type ValorantAgent } from "@/lib/agents";
import Image from "next/image";
import { Save, Share2, RefreshCw, Loader2 } from "lucide-react";
import { saveTierList } from "@/actions/tierlists";
import { useRouter } from "next/navigation";

type ItemsMap = Record<string, ValorantAgent[]>;

export function TierListBuilder() {
  const [items, setItems] = useState<ItemsMap>(() => {
    const initial: ItemsMap = { "unranked": [...AGENTS] };
    TIER_ROWS.forEach(row => { initial[row.id] = []; });
    return initial;
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const activeAgent = activeId ? Object.values(items).flat().find(a => a.id === activeId) : null;

  function findContainer(id: string) {
    if (items[id]) return id;
    for (const key of Object.keys(items)) {
      if (items[key].find(item => item.id === id)) return key;
    }
    return null;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(String(active.id));
    const overContainer = findContainer(String(over.id)) || String(over.id); // It might be dragged over empty droppable

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex(i => i.id === active.id);
      const overIndex = overItems.findIndex(i => i.id === over.id);

      const newIndex = overIndex >= 0 ? overIndex : overItems.length + 1;

      return {
        ...prev,
        [activeContainer]: [...activeItems.filter(item => item.id !== active.id)],
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          activeItems[activeIndex],
          ...overItems.slice(newIndex, overItems.length),
        ]
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeContainer = findContainer(String(active.id));
    const overContainer = findContainer(String(over?.id));

    if (activeContainer && overContainer && activeContainer === overContainer) {
      const activeIndex = items[activeContainer].findIndex(i => i.id === active.id);
      const overIndex = items[overContainer].findIndex(i => i.id === over?.id);

      if (activeIndex !== overIndex) {
        setItems((prev) => ({
          ...prev,
          [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
        }));
      }
    }

    setActiveId(null);
  }

  function resetTiers() {
    if (!confirm("Biztosan visszaállítod a Tier Listet az alap állapotra?")) return;
    const initial: ItemsMap = { "unranked": [...AGENTS] };
    TIER_ROWS.forEach(row => { initial[row.id] = []; });
    setItems(initial);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const title = prompt("Mi legyen a Tier List neve?", "Saját Tier Listem") || "Saját Tier Listem";
      const res = await saveTierList(items, title);
      if (res.success) {
        alert("Sikeres mentés! Most már megoszthatod a linket.");
        router.push(`/tier-list/${res.id}`);
      }
    } catch (err) {
      alert("Hiba történt a mentés során.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleShare() {
    alert("Kérlek előbb mentsd el a Tier Listet, utána fogod tudni lemásolni a megosztó linkjét az URL sávból!");
  }

  return (
    <div>
      {/* TOOLBAR */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
        <button onClick={resetTiers} className="admin-btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <RefreshCw size={16} /> Újrakezdés
        </button>
        <button onClick={handleShare} className="admin-btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--color-site-card)" }}>
          <Share2 size={16} /> Megosztás
        </button>
        <button onClick={handleSave} disabled={isSaving} className="admin-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--color-esport-teal)", color: "#000", border: "none", opacity: isSaving ? 0.7 : 1 }}>
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
          Mentés Galériába
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        {/* TIER ROWS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", background: "var(--color-site-card)", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--color-site-border)", marginBottom: "3rem" }}>
          {TIER_ROWS.map((row) => (
            <DroppableRow key={row.id} id={row.id} label={row.label} color={row.color}>
              <SortableContext items={items[row.id].map(i => i.id)} strategy={horizontalListSortingStrategy}>
                {items[row.id].map((agent) => (
                  <SortableItem key={agent.id} id={agent.id} agent={agent} />
                ))}
              </SortableContext>
            </DroppableRow>
          ))}
        </div>

        {/* UNRANKED BANK */}
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--color-site-muted)", textTransform: "uppercase", marginBottom: "1rem" }}>
            Besorolásra Váró Ágensek
          </h3>
          <div style={{ background: "var(--color-site-card)", border: "1px dashed var(--color-site-border)", padding: "1.5rem", minHeight: "120px", borderRadius: "8px" }}>
            <DroppableRow id="unranked" isBank>
              <SortableContext items={items["unranked"].map(i => i.id)} strategy={horizontalListSortingStrategy}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {items["unranked"].map((agent) => (
                    <SortableItem key={agent.id} id={agent.id} agent={agent} />
                  ))}
                </div>
              </SortableContext>
            </DroppableRow>
          </div>
        </div>

        <DragOverlay>
          {activeAgent ? (
            <div style={{ width: "80px", height: "80px", border: "3px solid var(--color-esport-teal)", borderRadius: "2px", overflow: "hidden", cursor: "grabbing", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }}>
              <Image src={activeAgent.imageUrl} alt={activeAgent.name} width={80} height={80} style={{ objectFit: "cover" }} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
