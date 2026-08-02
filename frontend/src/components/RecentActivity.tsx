import { motion } from "framer-motion";
import { Bell, FileText, ListChecks, Mic2, type LucideIcon } from "lucide-react";

type Activity = {
  id: string;
  title: string;
  time: string;
  icon: LucideIcon;
};

// TODO: Fetch dashboard data from FastAPI
const activities: Activity[] = [
  { id: "1", title: "Completed DBMS mock exam", time: "1 min ago", icon: FileText },
  { id: "2", title: "Generated 25 MCQs on Operating Systems", time: "24 min ago", icon: ListChecks },
  { id: "3", title: "Viva practice: Computer Networks", time: "2 hours ago", icon: Mic2 },
  { id: "4", title: "Reminder set for Maths-3 revision", time: "Yesterday", icon: Bell },
];

export function RecentActivity() {
  return (
    <section
      aria-labelledby="activity-heading"
      className="rounded-3xl border border-border bg-card p-5 shadow-card"
    >
      <h2 id="activity-heading" className="text-base font-semibold text-foreground">
        Recent Activity Timeline
      </h2>

      <ol className="mt-4 space-y-4">
        {activities.map((activity, index) => (
          <motion.li
            key={activity.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex min-w-0 gap-3"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
              <activity.icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export default RecentActivity;
