"use client";

import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  id: string;
  label: string;
  color: string;
  dotColor: string;
  count: number;
  children: React.ReactNode;
}

export default function KanbanColumn({
  id,
  label,
  color,
  dotColor,
  count,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl p-2.5 transition-colors min-h-[200px] ${
        isOver
          ? "bg-bg-tertiary/60 ring-1 ring-border-light"
          : "bg-bg-secondary/30"
      }`}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <p className={`text-xs font-semibold ${color}`}>{label}</p>
        <span className="text-[10px] text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded-md">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}
