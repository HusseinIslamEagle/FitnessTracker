import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import logo from "@shared/assets/logo.png";
import ProfileDropdown from "@shared/components/ProfileDropdown";

// ✅ optional preloading (keeps transitions smooth)
const preloaders = {
  "/": () => import("@features/home/pages/Home"),
  "/contact": () => import("@features/contact/pages/Contact"),
  "/calories": () => import("@features/calories/pages/CalorieCalculator"),
  "/feedback": () => import("@features/feedback/pages/Feedback"),
  "/tracker": () => import("@features/tracker/pages/PremiumTracker"),

  "/dashboard": () => import("@features/dashboard/pages/Dashboard"),
  "/workouts": () => import("@features/workouts/pages/Workouts"),
  "/progress": () => import("@features/progress/pages/Progress"),
  "/settings": () => import("@features/settings/pages/Settings"),
};

export default function Navbar({ user, onToggleSidebar, onOpenModal }) {
  const location = useLocation();
  const [mobileOpenGuest, setMobileOpenGuest] = useState(false);

  const guestNav = [
    { label: "Home", path: "/" },
    { label: "Contact", path: "/contact" },
    { label: "Calorie Calculator", path: "/calories" },
    { label: "Fitness Tracker", path: "/tracker" },
  ];

  // ✅ close guest menu on route change
  useEffect(() => {
    setMobileOpenGuest(false);
  }, [location.pathname]);

  function NavItem({ label, path }) {
    const isActive = location.pathname === path;

    const preload = () => {
      const fn = preloaders[path];
      if (fn) fn();
    };

    return (
      <Link
        to={path}
        onMouseEnter={preload}
        onFocus={preload}
        className="relative px-4 py-2 font-medium"
      >
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{
            opacity: isActive ? 1 : 0,
            scale: isActive ? 1 : 0.985,
            filter: isActive ? "blur(0px)" : "blur(2px)",
          }}
          transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.6 }}
          className="absolute inset-0 rounded-full bg-orange-500/15 border border-orange-500/35"
        />
        <motion.span
          initial={false}
          whileHover={{ y: -1 }}
          transition={{ duration: 0.12 }}
          className={`relative z-10 ${
            isActive ? "text-orange-500" : "text-gray-400 hover:text-orange-500"
          }`}
        >
          {label}
        </motion.span>
      </Link>
    );
  }

  // ===========================
  // ✅ USER NAVBAR (minimal)
  // ===========================
  if (user) {
    return (
      <nav className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-xl bg-black/70 isolation-isolate">
        <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5">
          {/* Menu icon => Sidebar */}
          <button
            onClick={onToggleSidebar}
            className="inline-flex text-gray-300 hover:text-orange-500 transition"
            aria-label="Toggle sidebar"
          >
            <Menu size={26} />
          </button>

          {/* Logo */}
          <Link to="/" aria-label="Go home" className="shrink-0">
            <img src={logo} alt="logo" className="h-10 md:h-14" />
          </Link>

          {/* Profile */}
          <ProfileDropdown />
        </div>
      </nav>
    );
  }

  // ===========================
  // ✅ GUEST NAVBAR (keep it)
  // ===========================
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-xl bg-black/70">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5">
        {/* Left */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Mobile guest: simple toggle (optional) */}
          <button
            onClick={() => setMobileOpenGuest((p) => !p)}
            className="md:hidden inline-flex text-gray-300 hover:text-orange-500 transition"
            aria-label="Open guest menu"
          >
            <Menu size={26} />
          </button>

          {/* Desktop guest links */}
          <div className="hidden md:flex space-x-4">
            {guestNav.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* Center logo */}
        <Link to="/" aria-label="Go home" className="shrink-0">
          <img src={logo} alt="logo" className="h-10 md:h-14" />
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3 md:gap-6">
          <button
            onClick={() => onOpenModal("signup")}
            className="hidden md:inline-flex px-6 py-2 bg-orange-500 text-black rounded-full font-bold"
          >
            Start Your Journey
          </button>

          <button
            onClick={() => onOpenModal("signin")}
            className="hidden md:inline-flex text-gray-300 hover:text-orange-500 transition"
          >
            Sign In
          </button>

          {/* mobile CTA */}
          <button
            onClick={() => onOpenModal("signin")}
            className="md:hidden px-4 py-2 rounded-full bg-orange-500 text-black font-bold"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Mobile guest dropdown links (simple) */}
      {mobileOpenGuest && (
        <div className="md:hidden px-4 pb-4">
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-3 flex flex-col gap-1">
            {guestNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-2 rounded-xl text-gray-200 hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}