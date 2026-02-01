// AppShell.tsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import "./styles/appShell.css";

import { Sidebar } from "../components/layout/Sidebar";
import { MainHeader } from "../components/layout/MainHeader";
import { SettingsDrawer } from "../components/layout/SettingsDrawer";

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setSidebarOpen(false);
      // opcional: cerrar settings también en desktop
      // if (window.innerWidth >= 900) setSettingsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="appShell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <section className="main">
        <MainHeader
          onOpenSidebar={() => {
            setSettingsOpen(false);
            setSidebarOpen(true);
          }}
          onOpenSettings={() => {
            setSidebarOpen(false);
            setSettingsOpen(true);
          }}
        />

        <main className="mainContent">
          <Outlet />
        </main>

        <SettingsDrawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </section>
    </div>
  );
}
