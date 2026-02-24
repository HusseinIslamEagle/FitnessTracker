import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import CustomCursor from "../components/CustomCursor";
import Sidebar from "../components/Sidebar";
import AuthModal from "../components/AuthModal";

import Navbar from "./Navbar";
import Footer from "./Footer";
import AppRoutes from "../routes/AppRoutes";

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