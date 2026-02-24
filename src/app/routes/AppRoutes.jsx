import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import AnimatedPage from "@app/layout/AnimatedPage";
import ProtectedRoute from "@app/routes/ProtectedRoute";

const Home = lazy(() => import("@features/home/pages/Home"));
const UserHome = lazy(() => import("@features/home/pages/UserHome"));

const Contact = lazy(() => import("@features/contact/pages/Contact"));
const CalorieCalculator = lazy(() =>
  import("@features/calories/pages/CalorieCalculator")
);
const Feedback = lazy(() => import("@features/feedback/pages/Feedback"));

const Dashboard = lazy(() => import("@features/dashboard/pages/Dashboard"));
const Workouts = lazy(() => import("@features/workouts/pages/Workouts"));
const Progress = lazy(() => import("@features/progress/pages/Progress"));
const PremiumTracker = lazy(() =>
  import("@features/tracker/pages/PremiumTracker")
);
const Settings = lazy(() => import("@features/settings/pages/Settings"));

export default function AppRoutes({ user }) {
  const location = useLocation();

  return (
    <Suspense fallback={null}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route
            path="/"
            element={
              <AnimatedPage>{user ? <UserHome /> : <Home />}</AnimatedPage>
            }
          />

          <Route
            path="/contact"
            element={
              <AnimatedPage>
                <Contact />
              </AnimatedPage>
            }
          />

          <Route
            path="/calories"
            element={
              <AnimatedPage>
                <CalorieCalculator />
              </AnimatedPage>
            }
          />

          <Route
            path="/feedback"
            element={
              <AnimatedPage>
                <Feedback />
              </AnimatedPage>
            }
          />

          {/* ✅ Tracker Public + force remount on auth change */}
          <Route
            path="/tracker"
            element={
              <AnimatedPage>
                <PremiumTracker key={user ? "auth" : "guest"} />
              </AnimatedPage>
            }
          />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute redirectTo="/">
                <AnimatedPage>
                  <Dashboard />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/workouts"
            element={
              <ProtectedRoute redirectTo="/">
                <AnimatedPage>
                  <Workouts />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <ProtectedRoute redirectTo="/">
                <AnimatedPage>
                  <Progress />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute redirectTo="/">
                <AnimatedPage>
                  <Settings />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}