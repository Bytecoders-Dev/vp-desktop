import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { ImmsCourtForm } from "./components/immsCourtForm";
import { LineChart } from "../../components/chart/LineChart";

export function ImmsCourtView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showDialogForm = useRef<OverlayPanel>(null);
  const [downloadInit, setDownloadInit] = useState<boolean>(false);

  const records = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 120 }, () => {
      const d = new Date(now);
      d.setDate(now.getDate() - Math.floor(Math.random() * 14));
      return { createdAt: d };
    });
  }, []);

  return (
    <div>
      <div className="flex justify-content-between align-items-center mb-4 mx-1">
        <div>
          <h2 style={{ margin: "0 0 8px" }}>{t("nexia.immsCourt.title")}</h2>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5 }}>
            {t("nexia.immsCourt.description")}
          </p>
        </div>
        {downloadInit ? (
          <Button
            type="button"
            icon="pi pi-external-link"
            label={t("nexia.immsCourt.downloadDetails")}
            onClick={() => navigate("/nexia/imms-court-download-details")}
          />
        ) : (
          <Button
            type="button"
            icon="pi pi-download"
            label={t("common.download")}
            onClick={(e) => showDialogForm.current?.toggle(e)}
          />
        )}
      </div>
      <OverlayPanel ref={showDialogForm}>
        <ImmsCourtForm
          showDialogForm={showDialogForm}
          setDownloadInit={setDownloadInit}
        />
      </OverlayPanel>
      {/* <ImmsCourtDownloadDetails /> */}
      <LineChart records={records} defaultPeriod="day" />
    </div>
  );
}
