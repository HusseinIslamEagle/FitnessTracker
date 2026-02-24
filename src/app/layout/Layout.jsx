
import Footer from "@app/layout/Footer";
import Navbar from "@app/layout/Navbar";
import AppRoutes from "@app/routes/AppRoutes";
import AuthModal from "@features/auth/components/AuthModal";
import { useAuth } from "@features/auth/context/AuthContext";
import CustomCursor from "@shared/components/CustomCursor";
import Sidebar from "@shared/components/Sidebar";
import { useState } from "react";

export default function Layout() {
  const { user } = useAuth();

  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <CustomCursor />

      {user && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}

      <Navbar
        user={user}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenModal={(type) => setModal(type)}
      />

      <AppRoutes user={user} />

      {modal && <AuthModal type={modal} close={() => setModal(null)} />}

      <Footer />
    </div>
  );
}