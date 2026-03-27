"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Conversation, ConversationStatus, ClientIntelligence } from "@/types/database";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import DraggableCard from "./DraggableCard";

interface ColumnDef {
  status: ConversationStatus;
  label: string;
  color: string;
  dotColor: string;
}

const COLUMNS: ColumnDef[] = [
  { status: "active", label: "Ativos", color: "text-emerald-400", dotColor: "bg-emerald-400" },
  { status: "remarketing", label: "Remarketing", color: "text-amber-400", dotColor: "bg-amber-400" },
  { status: "closed", label: "Fechados", color: "text-blue-400", dotColor: "bg-blue-400" },
  { status: "desqualified", label: "Desqualificados", color: "text-red-400", dotColor: "bg-red-400" },
];

interface KanbanBoardProps {
  conversations: Conversation[];
  intelMap: Record<string, ClientIntelligence>;
  notesMap: Record<string, string>;
  msgCounts: Record<string, number>;
  onStatusChange: (convId: string, newStatus: ConversationStatus) => void;
  onCardClick: (convId: string) => void;
}

export default function KanbanBoard({
  conversations,
  intelMap,
  notesMap,
  msgCounts,
  onStatusChange,
  onCardClick,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const byStatus = (status: ConversationStatus) =>
    conversations.filter((c) => (c.status || "active") === status);

  const activeConv = activeId ? conversations.find((c) => c.id === activeId) : null;

  const findColumnOfItem = (id: string): ConversationStatus | null => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) return conv.status || "active";
    if (COLUMNS.some((col) => col.status === id)) return id as ConversationStatus;
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Visual feedback handled by DragOverlay
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeConvId = active.id as string;
    const overId = over.id as string;

    let targetStatus: ConversationStatus | null = null;

    if (COLUMNS.some((col) => col.status === overId)) {
      targetStatus = overId as ConversationStatus;
    } else {
      targetStatus = findColumnOfItem(overId);
    }

    if (!targetStatus) return;

    const currentConv = conversations.find((c) => c.id === activeConvId);
    if (!currentConv) return;

    const currentStatus = currentConv.status || "active";
    if (currentStatus !== targetStatus) {
      onStatusChange(activeConvId, targetStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const convs = byStatus(col.status);
          return (
            <KanbanColumn
              key={col.status}
              id={col.status}
              label={col.label}
              color={col.color}
              dotColor={col.dotColor}
              count={convs.length}
            >
              <SortableContext
                items={convs.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 flex-1 min-h-[100px]">
                  {convs.length === 0 ? (
                    <div className="border-2 border-dashed border-border/50 rounded-lg py-10 text-center">
                      <p className="text-[10px] text-text-muted/30">
                        Arraste cards aqui
                      </p>
                    </div>
                  ) : (
                    convs.map((conv) => (
                      <DraggableCard key={conv.id} id={conv.id}>
                        <KanbanCard
                          conversation={conv}
                          intel={intelMap[conv.id] || null}
                          note={notesMap[conv.id] || ""}
                          messageCount={msgCounts[conv.id] || 0}
                          onClick={() => onCardClick(conv.id)}
                        />
                      </DraggableCard>
                    ))
                  )}
                </div>
              </SortableContext>
            </KanbanColumn>
          );
        })}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeConv && (
          <div className="opacity-90 rotate-2 scale-105">
            <KanbanCard
              conversation={activeConv}
              intel={intelMap[activeConv.id] || null}
              note={notesMap[activeConv.id] || ""}
              messageCount={msgCounts[activeConv.id] || 0}
              onClick={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
