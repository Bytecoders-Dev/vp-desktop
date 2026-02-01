import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { SidebarItem } from "./SidebarItem";
import { SidebarSubmenu } from "./SidebarSubmenu";
import "./styles/sidebar.css";
import { ThemeLogo } from "../common/ThemeLogo";
import { menuOptions, type MenuOption } from "./menuOptions";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

function hasActivePath(item: MenuOption, pathname: string): boolean {
  if (item.path && pathname.startsWith(item.path)) return true;
  return (item.children ?? []).some((c) => hasActivePath(c, pathname));
}

function collectOpenKeys(
  items: MenuOption[],
  pathname: string,
  acc = new Set<string>(),
): Set<string> {
  for (const item of items) {
    if (item.children?.length) {
      if (hasActivePath(item, pathname)) {
        acc.add(item.key);
        collectOpenKeys(item.children, pathname, acc);
      }
    }
  }
  return acc;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const [openKeys, setOpenKeys] = useState<Set<string>>(() => new Set());

  // Auto-abrir el árbol que contiene la ruta actual
  useEffect(() => {
    setOpenKeys(collectOpenKeys(menuOptions, pathname));
  }, [pathname]);

  const toggleKey = useCallback((key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const renderNode = useCallback(
    (item: MenuOption, level = 0) => {
      const label = t(item.i18nKey as string, { defaultValue: "" });

      if (item.children?.length) {
        return (
          <SidebarSubmenu
            key={item.key}
            item={item}
            label={label}
            level={level}
            isOpen={openKeys.has(item.key)}
            onToggle={toggleKey}
            renderChild={renderNode}
          />
        );
      }

      return (
        <div key={item.key}>
          <div style={{ marginLeft: level * 12 }}>
            <SidebarItem icon={item.icon} label={label} href={item.path} />
          </div>
        </div>
      );
    },
    [openKeys, t, toggleKey],
  );

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
          {menuOptions.map((item) => renderNode(item, 0))}
        </nav>
      </aside>
    </>
  );
}
