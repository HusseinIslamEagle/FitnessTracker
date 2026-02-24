import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Footer from "@app/layout/Footer";
import Navbar from "@app/layout/Navbar";
import AppRoutes from "@app/routes/AppRoutes";
import AuthModal from "@features/auth/components/AuthModal";
import { useAuth } from "@features/auth/context/AuthContext";
import CustomCursor from "@shared/components/CustomCursor";
import Sidebar from "@shared/components/Sidebar";

export default function Layout() {
  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Read auth modal from URL (no setState in effect)
  const modalFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const authMode = params.get("auth");
    return authMode === "signin" || authMode === "signup" ? authMode : null;
  }, [location.search]);

  const effectiveModal = modal ?? modalFromQuery;

  // ✅ Close modal + remove auth query only when closing
  const closeModal = useCallback(() => {
    setModal(null);

    const params = new URLSearchParams(location.search);
    if (params.has("auth")) {
      params.delete("auth");
      const nextSearch = params.toString();

      navigate(
        {
          pathname: location.pathname,
          search: nextSearch ? `?${nextSearch}` : "",
        },
        { replace: true }
      );
    }
  }, [location.pathname, location.search, navigate]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-x-hidden">
      <CustomCursor />

      {user && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}

      <Navbar
        user={user}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenModal={(type) => setModal(type)}
      />

      <AppRoutes user={user} />

      {effectiveModal && <AuthModal type={effectiveModal} close={closeModal} />}

      <Footer />
    </div>
  );
}