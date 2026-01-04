import { useTranslation } from "react-i18next";

import { SidebarItem } from "./SidebarItem";
import "./styles/sidebar.css";
import { ThemeLogo } from "../common/ThemeLogo";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const menuOptions = [
  { key: "home", i18nKey: "sidebar.items.home", icon: "🏠" },
  { key: "projects", i18nKey: "sidebar.items.projects", icon: "📁" },
  { key: "settings", i18nKey: "sidebar.items.tools", icon: "⚙️" },
] as const;

export function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <>
      {open && (
        <div className="sidebarOverlay" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`sidebar ${open ? "isOpen" : ""}`} aria-label="Sidebar">
        <div className="sidebarBrand">
          <div className="brandBadge">
            <ThemeLogo alt="VP App logo" className="sidebarLogo" />
          </div>
        </div>

        <nav className="sidebarNav">
          {menuOptions.map((menu) => (
            <SidebarItem
              key={menu.key}
              icon={menu.icon}
              label={t(menu.i18nKey)}
              href="#"
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
