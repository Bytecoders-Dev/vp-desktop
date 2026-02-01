import { useTranslation } from "react-i18next";

export function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="card">
      <h2 style={{ margin: "0 0 8px" }}>{t("pages.settings.title")}</h2>
      <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5 }}>
        {t("pages.settings.description")}
      </p>
    </div>
  );
}
