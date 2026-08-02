import { motion } from "framer-motion";
import { Flame } from "lucide-react";

// TODO: Fetch dashboard data from FastAPI
const week = [
  { day: "M", value: 40 },
  { day: "T", value: 65 },
  { day: "W", value: 30 },
  { day: "T", value: 85 },
  { day: "F", value: 55 },
  { day: "S", value: 95 },
  { day: "S", value: 70 },
];

interface StudyStreakProps {
  days?: number;
}

export function StudyStreak({ days = 15 }: StudyStreakProps) {
  return (
    <section
      aria-labelledby="streak-heading"
      className="rounded-3xl border border-border bg-card p-5 shadow-card text-primary"
    >
      <div className="flex min-w-0 items-center justify-between gap-3 text-primary">
        <h2 id="streak-heading" className="truncate text-base font-semibold text-foreground text-primary">
          Study Streak
        </h2>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-accent-foreground">
          <Flame className="size-3.5" aria-hidden="true" />
          {days} days
        </span>
      </div>

      <div className="mt-5 flex h-28 items-stretch justify-between gap-2">
        {week.map((entry, index) => (
          <div key={`${entry.day}-${index}`} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${entry.value}%` }}
              style={{ maxHeight: "100%" }}
              transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
              className="w-full rounded-full bg-gradient-primary"
            />
            <span className="text-[11px] text-muted-foreground">{entry.day}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StudyStreak;
