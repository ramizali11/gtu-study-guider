import { HeroSection } from "../components/HeroSection";
import { ProgressCard } from "../components/ProgressCard";
import { QuickActions } from "../components/QuickActions";
import { RecentActivity } from "../components/RecentActivity";
import { StudyGoals } from "../components/StudyGoals";
import { StudyStreak } from "../components/StudyStreak";
import { UpcomingExam } from "../components/UpcomingExam";
import { DashboardLayout } from "../layouts/DashboardLayout";

// TODO: Fetch dashboard data from FastAPI
export function Dashboard() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          <HeroSection />
          <QuickActions />
          <div className="grid gap-4 md:grid-cols-2">
            <RecentActivity />
            <StudyGoals />
          </div>
        </div>

        <aside className="flex min-w-0 flex-col gap-6">
          <ProgressCard />
          <StudyStreak />
          <UpcomingExam />
        </aside>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;