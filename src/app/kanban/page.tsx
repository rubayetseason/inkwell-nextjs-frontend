"use client";

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { kanbanApi } from "@/services/kanban.services";
import { useAuthStore } from "@/store/auth.store";
import { KanbanCard, KanbanColumn, KanbanPriority } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Edit3,
  Flag,
  Flame,
  Loader2,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DragEvent, useEffect, useState } from "react";

const COLUMNS: {
  id: KanbanColumn;
  label: string;
  color: string;
  bg: string;
}[] = [
  {
    id: "backlog",
    label: "Backlog",
    color: "text-neutral-400",
    bg: "bg-neutral-500/10 border-neutral-500/20",
  },
  {
    id: "todo",
    label: "To Do",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    id: "doing",
    label: "In Progress",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "done",
    label: "Done",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const PRIORITY_COLORS: Record<KanbanPriority, string> = {
  low: "text-slate-400 bg-slate-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  high: "text-orange-400 bg-orange-400/10",
  urgent: "text-red-400 bg-red-400/10",
};

export default function KanbanPage() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [activeCol, setActiveCol] = useState<KanbanColumn | null>(null);
  const { user } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchBoard();
  }, [user]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
                  style={{ fontFamily: "var(--font-display)" }}
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

// ── Column ──────────────────────────────────────
function KanbanColumnComponent({
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

// ── Card ──────────────────────────────────────
function KanbanCardComponent({
  card,
  index,
  onDragStart,
  onUpdate,
  onDelete,
}: {
  card: KanbanCard;
  index: number;
  onDragStart: (e: DragEvent, card: KanbanCard) => void;
  onUpdate: (card: KanbanCard) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDesc, setEditDesc] = useState(card.description);
  const [editPriority, setEditPriority] = useState(card.priority);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await kanbanApi.updateCard(card._id, {
        title: editTitle,
        description: editDesc,
        priority: editPriority,
      });
      onUpdate(res.data);
      setIsEditing(false);
      toast({ title: "Card updated" });
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await kanbanApi.deleteCard(card._id);
      onDelete(card._id);
      toast({ title: "Card deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  if (isEditing) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card border border-primary/30 rounded-xl p-3 space-y-2"
      >
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="text-sm h-8"
          autoFocus
        />
        <Textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Description..."
          rows={2}
          className="text-xs resize-none"
        />
        <select
          value={editPriority}
          onChange={(e) => setEditPriority(e.target.value as KanbanPriority)}
          className="w-full text-xs bg-background border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="urgent">Urgent</option>
        </select>
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(false)}
            className="h-7 text-xs"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-7 text-xs gap-1"
          >
            {isSaving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Check className="w-3 h-3" />
            )}
            Save
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      layoutId={card._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      draggable
      onDragStart={(e: any) => onDragStart(e, card)}
      className="group bg-card border border-border rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-sm font-medium leading-snug flex-1">{card.title}</p>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded text-muted-foreground hover:text-foreground"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {card.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {card.description}
        </p>
      )}

      <span
        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[card.priority]}`}
      >
        <Flag className="w-2.5 h-2.5" />
        {card.priority}
      </span>
    </motion.div>
  );
}

// ── Add Card Form ────────────────────────────
function AddCardForm({
  column,
  onAdd,
  onClose,
}: {
  column: KanbanColumn;
  onAdd: (card: KanbanCard) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<KanbanPriority>("medium");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsLoading(true);
    try {
      const res = await kanbanApi.createCard({
        title: title.trim(),
        description,
        priority,
        status: column,
      });
      onAdd(res.data);
    } catch {
      toast({ title: "Failed to create card", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="mt-2 bg-card border border-primary/30 rounded-xl p-3 space-y-2"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title..."
        className="text-sm h-8"
        autoFocus
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)..."
        rows={2}
        className="text-xs resize-none"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as KanbanPriority)}
        className="w-full text-xs bg-background border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary"
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
        <option value="urgent">Urgent</option>
      </select>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !title.trim()}
          className="h-7 text-xs gap-1"
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
          Add
        </Button>
      </div>
    </motion.form>
  );
}

// ── Burn Barrel ───────────────────────────────
function BurnBarrel({ onDrop }: { onDrop: (cardId: string) => void }) {
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
