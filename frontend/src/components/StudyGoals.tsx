import { useState } from "react";
import { Check } from "lucide-react";

import { cn } from "../lib/utils";

type Goal = {
  id: string;
  label: string;
  done: boolean;
};

// TODO: Fetch dashboard data from FastAPI
const initialGoals: Goal[] = [
  { id: "mcqs", label: "MCQs Solved", done: true },
  { id: "mock", label: "Mock Exams", done: true },
  { id: "hours", label: "Study Hours", done: false },
  { id: "viva", label: "Viva Session", done: false },
];

export function StudyGoals() {
  const [goals, setGoals] = useState(initialGoals);
  const completed = goals.filter((goal) => goal.done).length;

  const toggleGoal = (id: string) => {
    // TODO: Persist goal completion to FastAPI
    setGoals((current) =>
      current.map((goal) => (goal.id === id ? { ...goal, done: !goal.done } : goal)),
    );
  };

  return (
    <section
      aria-labelledby="goals-heading"
      className="rounded-3xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <h2 id="goals-heading" className="truncate text-base font-semibold text-foreground">
          Today&apos;s Goal
        </h2>
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          {completed}/{goals.length}
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {goals.map((goal) => (
          <li key={goal.id}>
            <button
              type="button"
              onClick={() => toggleGoal(goal.id)}
              aria-pressed={goal.done}
              className="flex w-full min-w-0 items-center gap-3 text-left"
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
                  goal.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background",
                )}
              >
                {goal.done ? <Check className="size-3.5" aria-hidden="true" /> : null}
              </span>
              <span
                className={cn(
                  "truncate text-sm transition-colors",
                  goal.done ? "text-muted-foreground line-through" : "text-foreground",
                )}
              >
                {goal.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default StudyGoals;
