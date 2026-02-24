import { motion, AnimatePresence } from "framer-motion";
import {
  Home as HomeIcon,
  LayoutDashboard,
  Dumbbell,
  LineChart,
  Activity,
  Flame,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  const nav = [
    { label: "Home", icon: <HomeIcon size={20} />, path: "/" },
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { label: "Workouts", icon: <Dumbbell size={20} />, path: "/workouts" },
    { label: "Progress", icon: <LineChart size={20} />, path: "/progress" },
    { label: "Tracker", icon: <Activity size={20} />, path: "/tracker" },
    { label: "Calories", icon: <Flame size={20} />, path: "/calories" }
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ===== Overlay ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
          />

          {/* ===== Sidebar ===== */}
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed top-0 left-0 h-full w-[260px]
                       bg-[#0f0f0f]/95 backdrop-blur-2xl
                       border-r border-white/10
                       z-[90] flex flex-col"
          >
            {/* ===== Header ===== */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
              <span className="text-orange-500 font-bold tracking-wider">
                Navigation
              </span>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-orange-500 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* ===== Nav Items ===== */}
            <div className="flex flex-col py-6 space-y-2 px-4">
              {nav.map((item, i) => {
                const active = location.pathname === item.path;

                return (
                  <Link
                    key={i}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className="relative"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition
                        ${
                          active
                            ? "bg-orange-500/15 text-orange-500"
                            : "text-gray-400 hover:text-orange-500 hover:bg-white/5"
                        }`}
                    >
                      {item.icon}
                      <span className="font-medium tracking-wide">
                        {item.label}
                      </span>

                      {/* Active Indicator */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-full"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* ===== Footer Area (Optional Future Upgrade) ===== */}
            <div className="mt-auto px-6 py-6 border-t border-white/10 text-xs text-gray-500">
              Fitness Platform v1.0
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}