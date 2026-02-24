import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AnimatedPage from "../layout/AnimatedPage";

import Feedback from "../pages/Feedback";
import Home from "../pages/Home";
import UserHome from "../pages/UserHome";
import Contact from "../pages/Contact";
import CalorieCalculator from "../pages/CalorieCalculator";
import Settings from "../pages/Settings";
import Dashboard from "../pages/Dashboard";
import Workouts from "../pages/Workouts";
import Progress from "../pages/Progress";
import PremiumTracker from "../pages/PremiumTracker";

export default function AppRoutes({ user }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
          path="/settings"
          element={
            <AnimatedPage>
              <Settings />
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
        <Route
          path="/dashboard"
          element={
            <AnimatedPage>
              <Dashboard />
            </AnimatedPage>
          }
        />
        <Route
          path="/workouts"
          element={
            <AnimatedPage>
              <Workouts />
            </AnimatedPage>
          }
        />
        <Route
          path="/progress"
          element={
            <AnimatedPage>
              <Progress />
            </AnimatedPage>
          }
        />
        <Route
          path="/tracker"
          element={
            <AnimatedPage>
              <PremiumTracker />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}