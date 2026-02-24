import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

import ProfileDropdown from "@shared/components/ProfileDropdown";
import logo from "@shared/assets/logo.png";

export default function Navbar({ user, onToggleSidebar, onOpenModal }) {
  const location = useLocation();

  const guestNav = [
    { label: "Home", path: "/" },
    { label: "Contact", path: "/contact" },
    { label: "Calorie Calculator", path: "/calories" },
    { label: "Fitness Tracker", path: "/tracker" },
  ];

  function NavItem({ label, path }) {
    const isActive = location.pathname === path;

    return (
      <Link to={path} className="relative px-4 py-2 font-medium">
        {isActive && (
          <motion.div
            layoutId="activePill"
            className="absolute inset-0 rounded-full bg-orange-500/20 border border-orange-500/40"
          />
        )}
        <span
          className={`relative z-10 ${
            isActive ? "text-orange-500" : "text-gray-400 hover:text-orange-500"
          }`}
        >
          {label}
        </span>
      </Link>
    );
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 border-b border-gray-800 backdrop-blur-xl bg-black/70">
      <div className="flex items-center space-x-6">
        {user && (
          <button
            onClick={onToggleSidebar}
            className="text-gray-400 hover:text-orange-500"
          >
            <Menu size={28} />
          </button>
        )}

        {!user && (
          <div className="flex space-x-4">
            {guestNav.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </div>
        )}
      </div>

      <Link to="/">
        <img src={logo} alt="logo" className="h-14" />
      </Link>

      <div className="flex items-center space-x-6">
        {!user ? (
          <>
            <button
              onClick={() => onOpenModal("signup")}
              className="px-6 py-2 bg-orange-500 text-black rounded-full"
            >
              Start Your Journey
            </button>

            <button
              onClick={() => onOpenModal("signin")}
              className="text-gray-400 hover:text-orange-500"
            >
              Sign In
            </button>
          </>
        ) : (
          <ProfileDropdown />
        )}
      </div>
    </nav>
  );
}