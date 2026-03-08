import { KanbanColumn, KanbanPriority } from "@/types";

export const COLUMNS: {
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

export const PRIORITY_COLORS: Record<KanbanPriority, string> = {
  low: "text-slate-400 bg-slate-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  high: "text-orange-400 bg-orange-400/10",
  urgent: "text-red-400 bg-red-400/10",
};