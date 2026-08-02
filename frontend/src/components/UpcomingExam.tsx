import { useEffect, useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

interface UpcomingExamProps {
  examName?: string;
  /** Exam date as an ISO string or timestamp. */
  examDate?: string | number;
}

export function UpcomingExam({
  examName = "GTU Semester Exam",
  // TODO: Fetch the real exam date from FastAPI
  examDate = "2026-08-20T09:00:00Z",
}: UpcomingExamProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const target = useMemo(() => new Date(examDate), [examDate]);

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const units = [
    { label: "Days", value: timeLeft?.days },
    { label: "Hours", value: timeLeft?.hours },
    { label: "Mins", value: timeLeft?.minutes },
    { label: "Secs", value: timeLeft?.seconds },
  ];

  return (
    <section
      aria-labelledby="exam-heading"
      className="rounded-3xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex min-w-0 items-center gap-2">
        <CalendarClock className="size-4 shrink-0 text-accent-foreground" aria-hidden="true" />
        <h2 id="exam-heading" className="truncate text-base font-semibold text-foreground">
          Upcoming GTU Exam Countdown
        </h2>
      </div>
      <p className="mt-1 truncate text-xs text-muted-foreground">{examName}</p>

      <dl className="mt-4 grid grid-cols-4 gap-2">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="rounded-2xl bg-primary-soft px-2 py-3 text-center transition-transform hover:-translate-y-0.5"
          >
            <dd className="text-xl font-extrabold tabular-nums text-accent-foreground">
              {unit.value === undefined ? "--" : String(unit.value).padStart(2, "0")}
            </dd>
            <dt className="mt-0.5 text-[11px] text-muted-foreground">{unit.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default UpcomingExam;
