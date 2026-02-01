import { useState } from "react";
import { runManualUpdate } from "./update";
import { useTranslation } from "react-i18next";

export function UpdateButton() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (loading) return;
    setLoading(true);

    const res = await runManualUpdate({ askBeforeInstall: true });

    setLoading(false);

    if (res.status === "no-update") {
      alert(t("updater.noUpdateAvailable"));
      return;
    }

    if (res.status === "cancelled") {
      return;
    }

    if (res.status === "error") {
      alert(`${t("updater.errorCheckingUpdates")}\n\n${res.error}`);
      return;
    }
  };

  return (
    <button
      style={{ marginLeft: 28 }}
      className="iconBtn"
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-label={t("common.search")}
      title={t("updater.checkForUpdates")}
    >
      {t("common.search")}
    </button>
  );
}
