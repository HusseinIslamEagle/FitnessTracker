import ActivityChart from "../components/dashboard/ActivityChart";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import AIInsights from "../components/dashboard/AIInsights";
import DashboardHero from "../components/dashboard/DashboardHero";
import Heatmap from "../components/dashboard/Heatmap";
import MotivationStrip from "../components/dashboard/MotivationStrip";
import StatsGrid from "../components/dashboard/StatsGrid";

import { loadWorkouts } from "@/shared/domain/workoutsRepository";
import { useAuth } from "@features/auth";

export default function Dashboard() {
  const { user } = useAuth();
  const isAuthed = Boolean(user);

  const workouts = loadWorkouts(isAuthed);

  return (
    <div className="min-h-screen px-10 py-10 space-y-16">
      <DashboardHero workouts={workouts} />

      <StatsGrid workouts={workouts} />

      <ActivityChart workouts={workouts} />

      <Heatmap workouts={workouts} />

      <AIInsights workouts={workouts} />

      <MotivationStrip workouts={workouts} />

      <ActivityTimeline workouts={workouts} />
    </div>
  );
}