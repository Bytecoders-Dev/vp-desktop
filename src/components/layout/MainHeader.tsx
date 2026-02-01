import "./styles/mainHeader.css";

import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/auth.store";

type MainHeaderProps = {
  onOpenSidebar: () => void;
  onOpenSettings: () => void;
};

export function MainHeader({ onOpenSidebar, onOpenSettings }: MainHeaderProps) {
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="mainTopbar">
      <button
        className="iconBtn iconBtn--menu"
        onClick={onOpenSidebar}
        aria-label={t("header.openMenu")}
        type="button"
      >
        ☰
      </button>

      <div className="mainTitle">{t("app.name")}</div>

      <div className="mainActions">
        <button
          className="iconBtn iconBtn--settings"
          onClick={onOpenSettings}
          aria-label={t("header.settings.openSettings")}
          type="button"
          title={t("header.settings.openSettings")}
        >
          ⚙️
        </button>

        <button className="iconBtn" type="button" onClick={logout}>
          {t("header.logout")}
        </button>
      </div>
    </div>
  );
}
