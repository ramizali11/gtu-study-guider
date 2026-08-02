import { motion } from "framer-motion";

type Metric = {
  label: string;
  value: string;
  progress: number;
};

// TODO: Fetch dashboard data from FastAPI
const metrics: Metric[] = [
  { label: "MCQs Solved", value: "263", progress: 82 },
  { label: "Mock Exams", value: "36", progress: 58 },
  { label: "Study Hours", value: "34hr", progress: 44 },
  { label: "Viva Sessions", value: "74", progress: 68 },
];

interface ProgressCardProps {
  completion?: number;
}

export function ProgressCard({ completion = 74 }: ProgressCardProps) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completion / 100) * circumference;

  return (
    <section
      aria-labelledby="progress-heading"
      className="rounded-3xl border border-border bg-card p-5 shadow-card"
    >
      <h2 id="progress-heading" className="text-base font-semibold text-foreground">
        Study Progress Card
      </h2>

      <div className="mt-4 grid place-items-center">
        <div className="relative size-40">
          <svg viewBox="0 0 160 160" className="size-full -rotate-90" aria-hidden="true">
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="fill-none stroke-muted"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              className="fill-none stroke-primary"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-2xl font-extrabold text-foreground">
            {completion}%
          </span>
        </div>
      </div>

      <ul className="mt-5 space-y-4">
        {metrics.map((metric) => (
          <li key={metric.label}>
            <div className="flex min-w-0 items-center justify-between gap-3">
              <span className="truncate text-sm text-muted-foreground">{metric.label}</span>
              <span className="shrink-0 text-sm font-semibold text-foreground">{metric.value}</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-primary"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProgressCard;
