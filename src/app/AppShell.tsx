import { useEffect, useState } from "react";

import "./styles/appShell.css";

import { Sidebar } from "../components/layout/Sidebar";
import { MainHeader } from "../components/layout/MainHeader";
import { useTranslation } from "react-i18next";

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="appShell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <section className="main">
        <MainHeader onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="mainContent">
          <div className="card">
            <h2 style={{ margin: "0 0 8px" }}>VP App</h2>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5 }}>
              {t("appShell.description")}
            </p>
          </div>
        </main>
      </section>
    </div>
  );
}
