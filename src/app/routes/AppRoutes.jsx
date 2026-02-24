import AnimatedPage from "@app/layout/AnimatedPage";
import ProtectedRoute from "@app/routes/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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
const PremiumTracker = lazy(() => import("@features/tracker/pages/PremiumTracker"));
const Settings = lazy(() => import("@features/settings/pages/Settings"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
      Loading...
    </div>
  );
}

export default function AppRoutes({ user }) {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
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
            path="/tracker"
            element={
              <ProtectedRoute redirectTo="/">
                <AnimatedPage>
                  <PremiumTracker />
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