import { useTranslation } from "react-i18next";

export function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div className="card">
      <h2 style={{ margin: "0 0 8px" }}>{t("pages.projects.title")}</h2>
      <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5 }}>
        {t("pages.projects.description")}
      </p>
    </div>
  );
}
