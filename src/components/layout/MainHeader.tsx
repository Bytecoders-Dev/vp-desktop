import "./styles/mainHeader.css";
import { useAuth } from "../../auth/auth.store";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/theme.store";
import { UpdateButton } from "../../updater/UpdateButton";

type MainHeaderProps = {
  onOpenSidebar: () => void;
};

export function MainHeader({ onOpenSidebar }: MainHeaderProps) {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const setLang = (lng: "es" | "en") => {
    void i18n.changeLanguage(lng);
  };

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
        <div className="langSwitch" aria-label={t("header.language")}>
          <button
            type="button"
            className={`iconBtn ${
              i18n.resolvedLanguage === "es" ? "isActive" : ""
            }`}
            onClick={() => setLang("es")}
          >
            ES
          </button>
          <button
            type="button"
            className={`iconBtn ${
              i18n.resolvedLanguage === "en" ? "isActive" : ""
            }`}
            onClick={() => setLang("en")}
          >
            EN
          </button>
        </div>

        {/* Toggle tema */}
        <button
          className="iconBtn"
          type="button"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <UpdateButton />

        <button className="iconBtn" type="button" onClick={logout}>
          {t("header.logout")}
        </button>
      </div>
    </div>
  );
}
