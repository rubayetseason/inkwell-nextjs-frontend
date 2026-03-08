"use client";

import {
    Flame,
    Trash2
} from "lucide-react";
import { useState } from "react";

export default function BurnBarrel({ onDrop }: { onDrop: (cardId: string) => void }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsActive(true);
      }}
      onDragLeave={() => setIsActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData("cardId");
        setIsActive(false);
        if (cardId) onDrop(cardId);
      }}
      className={`flex items-center justify-center rounded-xl border-2 border-dashed min-h-[120px] transition-all ${
        isActive
          ? "border-red-500 bg-red-500/10 text-red-400"
          : "border-neutral-700 bg-neutral-800/30 text-muted-foreground/30"
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        {isActive ? (
          <Flame className="w-8 h-8 animate-bounce text-red-400" />
        ) : (
          <Trash2 className="w-6 h-6" />
        )}
        <span className="text-xs font-medium">
          {isActive ? "Release to delete" : "Drop to delete"}
        </span>
      </div>
    </div>
  );
}
