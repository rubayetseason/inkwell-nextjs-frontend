"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITY_COLORS } from "@/constants/kanban";
import { useToast } from "@/hooks/use-toast";
import { kanbanApi } from "@/services/kanban.services";
import { KanbanCard, KanbanPriority } from "@/types";
import { motion } from "framer-motion";
import {
    Check,
    Edit3,
    Flag,
    Loader2,
    Trash2
} from "lucide-react";
import { DragEvent, useState } from "react";

export default function KanbanCardComponent({
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
