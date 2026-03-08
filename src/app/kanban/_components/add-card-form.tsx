"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { kanbanApi } from "@/services/kanban.services";
import { KanbanCard, KanbanColumn, KanbanPriority } from "@/types";
import { motion } from "framer-motion";
import {
    Loader2,
    Plus
} from "lucide-react";
import { useState } from "react";

export default function AddCardForm({
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