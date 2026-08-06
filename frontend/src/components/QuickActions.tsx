import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileQuestion,
  FileText,
  ListChecks,
  MessageSquare,
  Mic2,
  NotebookPen,
  type LucideIcon,
} from "lucide-react";

import { cn } from "../lib/utils";

type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge: string;
};

const actions: QuickAction[] = [
  
  {
    id: "ai-chat",
    title: "AI Chat",
    description: "Generate notes, solve GTU papers and summarize PDFs instantly.",
    icon: MessageSquare,
    badge: "Minimal",
  },
  {
    id: "GTU Exam Papers",
    title: "Exam papers",
    description: "Practice with papers built from previous GTU exams.",
    icon: FileText,
    badge: "Search",
  },
  {
    id: "mcq-generator",
    title: "MCQ Generator",
    description: "Turn any chapter into a smart MCQ set in seconds.",
    icon: ListChecks,
    badge: "Minimal",
  },
  {
    id: "viva-practice",
    title: "Viva Practice",
    description: "Rehearse viva questions with instant AI feedback.",
    icon: Mic2,
    badge: "Minimal",
  },
  {
    id: "pdf-summarizer",
    title: "PDF Summarizer",
    description: "Upload notes and get crisp, exam-ready summaries.",
    icon: NotebookPen,
    badge: "Minimal",
  },
  {
    id: "important-questions",
    title: "Important Questions",
    description: "Most repeated questions ranked by exam probability.",
    icon: FileQuestion,
    badge: "Minimal",
  },
];

interface QuickActionsProps {
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function QuickActions({ activeId = "ai-chat", onSelect }: QuickActionsProps) {
  const navigate = useNavigate();
  return (
    <section aria-label="Quick actions" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {actions.map((action, index) => {
        const isActive = action.id === activeId;
        return (
          <motion.article
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            whileHover={{ y: -4 }}
            className={cn(
              "group flex h-full flex-col rounded-2xl border bg-card p-4 shadow-card transition-colors",
              isActive  ? "border-sidebar-forground/40 bg-primary-soft/40 hover:border-primary" : "border-border hover:border-primary",
            )}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-accent-foreground transition-transform group-hover:scale-105">
                <action.icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-foreground">{action.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {onSelect?.(action.id); 
                if (action.id === "GTU Exam Papers") {
                  navigate("/papers");
                }
              }}
           
              className="mt-4 self-start rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {action.badge}
            </button>
          </motion.article>
        );
      })}
    </section>
  );
}

export default QuickActions;
