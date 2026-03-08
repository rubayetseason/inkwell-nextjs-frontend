"use client";

import { COLUMNS } from "@/constants/kanban";
import { KanbanCard, KanbanColumn } from "@/types";
import { AnimatePresence } from "framer-motion";
import {
    Plus
} from "lucide-react";
import { DragEvent, useState } from "react";
import AddCardForm from "./add-card-form";
import KanbanCardComponent from "./kanban-card-component";

export default function KanbanColumnComponent({
  col,
  cards,
  allCards,
  setCards,
  onDragStart,
  onDrop,
  onRefresh,
}: {
  col: (typeof COLUMNS)[0];
  cards: KanbanCard[];
  allCards: KanbanCard[];
  setCards: (cards: KanbanCard[]) => void;
  onDragStart: (e: DragEvent, card: KanbanCard) => void;
  onDrop: (e: DragEvent, col: KanbanColumn) => void;
  onRefresh: () => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="flex flex-col min-h-[400px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-semibold text-sm ${col.color}`}>{col.label}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${col.bg} ${col.color}`}
          >
            {cards.length}
          </span>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          setIsDragOver(false);
          onDrop(e, col.id);
        }}
        className={`flex-1 rounded-xl p-2 transition-all min-h-[300px] ${
          isDragOver
            ? `${col.bg} border border-dashed`
            : "bg-muted/20 border border-transparent"
        }`}
      >
        <div className="space-y-2">
          {cards.map((card, i) => (
            <KanbanCardComponent
              key={card._id}
              card={card}
              index={i}
              onDragStart={onDragStart}
              onUpdate={(updated) =>
                setCards(
                  allCards.map((c) => (c._id === updated._id ? updated : c)),
                )
              }
              onDelete={(id) => setCards(allCards.filter((c) => c._id !== id))}
            />
          ))}
        </div>

        {/* Add Card Form */}
        <AnimatePresence>
          {isAdding && (
            <AddCardForm
              column={col.id}
              onAdd={(card) => {
                setCards([...allCards, card]);
                setIsAdding(false);
              }}
              onClose={() => setIsAdding(false)}
            />
          )}
        </AnimatePresence>

        {!isAdding && cards.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-muted-foreground/50">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
}