"use client";

import { Button } from "@/components/ui/button";
import { COLUMNS } from "@/constants/kanban";
import { useToast } from "@/hooks/use-toast";
import { kanbanApi } from "@/services/kanban.services";
import { useAuthStore } from "@/store/auth.store";
import { KanbanCard, KanbanColumn } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, Send, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DragEvent, useEffect, useState } from "react";
import BurnBarrel from "./_components/burn-barrel";
import KanbanColumnComponent from "./_components/kanban-column-component";

export default function KanbanPage() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [activeCol, setActiveCol] = useState<KanbanColumn | null>(null);
  const { user, isLoading: isUserLoading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    fetchBoard();
  }, [user, isUserLoading]);

  const fetchBoard = async () => {
    try {
      const res = await kanbanApi.getBoard();
      setCards(res.data);
    } catch {
      toast({ title: "Failed to load board", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: DragEvent, card: KanbanCard) => {
    e.dataTransfer.setData("cardId", card._id);
  };

  const handleDrop = async (e: DragEvent, col: KanbanColumn) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    setActiveCol(null);

    const card = cards.find((c) => c._id === cardId);
    if (!card || card.status === col) return;

    // Optimistic update
    setCards((prev) =>
      prev.map((c) => (c._id === cardId ? { ...c, status: col } : c)),
    );

    try {
      await kanbanApi.updateCard(cardId, { status: col });
    } catch {
      setCards((prev) =>
        prev.map((c) => (c._id === cardId ? { ...c, status: card.status } : c)),
      );
      toast({ title: "Failed to move card", variant: "destructive" });
    }
  };

  const handleAiMove = async () => {
    if (!aiInput.trim() || isAiLoading) return;
    setIsAiLoading(true);
    setAiResult("");
    try {
      const res = await kanbanApi.aiMove(aiInput);
      const { moved, actions } = res.data;
      if (moved === 0) {
        setAiResult(
          `No cards matched your instruction. Try being more specific, e.g. "Move all urgent cards to doing".`,
        );
      } else {
        setAiResult(`✓ Moved ${moved} card${moved > 1 ? "s" : ""}.`);
        await fetchBoard();
      }
      setAiInput("");
    } catch {
      setAiResult(
        "AI move failed. Make sure OpenRouter API key is configured.",
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 px-4 pb-8">
        {/* Header */}
        <div className="max-w-[1600px] mx-auto mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 -ml-3">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              </Link>
              <div>
                <h1
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  My Kanban Board
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cards.length} total tasks
                </p>
              </div>
            </div>

            {/* AI Command Bar */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiMove()}
                  placeholder="AI: move urgent cards to doing..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-primary/30 rounded-xl focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button
                onClick={handleAiMove}
                disabled={isAiLoading || !aiInput.trim()}
                size="sm"
                className="gap-1.5 shrink-0"
              >
                {isAiLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isAiLoading ? "Moving..." : "Move"}
              </Button>
            </div>
          </div>

          {/* AI Result */}
          <AnimatePresence>
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex items-center justify-between gap-3 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary"
              >
                <span>{aiResult}</span>
                <button onClick={() => setAiResult("")}>
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Board */}
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {COLUMNS.map((col) => (
              <KanbanColumnComponent
                key={col.id}
                col={col}
                cards={cards.filter((c) => c.status === col.id)}
                allCards={cards}
                setCards={setCards}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onRefresh={fetchBoard}
              />
            ))}

            {/* Burn Barrel */}
            <BurnBarrel
              onDrop={async (cardId) => {
                const card = cards.find((c) => c._id === cardId);
                if (!card) return;
                setCards((prev) => prev.filter((c) => c._id !== cardId));
                try {
                  await kanbanApi.deleteCard(cardId);
                  toast({ title: "Card deleted" });
                } catch {
                  setCards((prev) => [...prev, card]);
                  toast({ title: "Failed to delete", variant: "destructive" });
                }
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
