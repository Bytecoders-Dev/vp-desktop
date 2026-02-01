import "./styles/settingsDrawer.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/theme.store";
import { UpdateButton } from "../../updater/UpdateButton";

type SettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const setLang = (lng: "es" | "en") => {
    void i18n.changeLanguage(lng);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`settingsOverlay ${open ? "isOpen" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`settingsDrawer ${open ? "isOpen" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={t("header.settings.title")}
      >
        <div className="settingsHeader">
          <div className="settingsTitle">{t("header.settings.title")}</div>

          <button
            className="iconBtn"
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            ✕
          </button>
        </div>

        {/* Body scrolleable */}
        <div className="settingsBody">
          {/* Language */}
          <section className="settingsSection">
            <div className="settingsSectionTitle">{t("header.language")}</div>

            <div className="segmented">
              <button
                type="button"
                className={`segmentedBtn ${
                  i18n.resolvedLanguage === "es" ? "isActive" : ""
                }`}
                onClick={() => setLang("es")}
              >
                {t("language.spanish")}
              </button>
              <button
                type="button"
                className={`segmentedBtn ${
                  i18n.resolvedLanguage === "en" ? "isActive" : ""
                }`}
                onClick={() => setLang("en")}
              >
                {t("language.english")}
              </button>
            </div>
          </section>

          {/* Theme */}
          <section className="settingsSection">
            <div className="settingsSectionTitle">
              {t("header.settings.theme.title")}
            </div>

            <button className="rowBtn" type="button" onClick={toggleTheme}>
              <span>{t("header.settings.theme.changeTheme")}</span>
              <span className="muted">
                {theme === "dark"
                  ? t("header.settings.theme.dark")
                  : t("header.settings.theme.light")}
              </span>
            </button>
          </section>
        </div>

        {/* Updater */}
        <div className="settingsFooter">
          <div className="settingsFooterTitle">
            {t("updater.checkForUpdates")}
          </div>
          <UpdateButton />
        </div>
      </aside>
    </>
  );
}
