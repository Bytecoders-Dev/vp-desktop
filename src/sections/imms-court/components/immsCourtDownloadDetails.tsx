import { useState, useEffect, useRef } from "react";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import { useTranslation } from "react-i18next";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";

export function ImmsCourtDownloadDetails() {
  const { t } = useTranslation();
  const [value, setValue] = useState<number>(0);
  const toast = useRef<Toast | null>(null);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const totalFiles = 100;

  useEffect(() => {
    let _val = value;

    interval.current = setInterval(() => {
      _val += Math.floor(Math.random() * 10) + 1;

      if (_val >= 100) {
        _val = 100;
        toast.current?.show({
          severity: "info",
          summary: "Success",
          detail: "Process Completed",
        });
        if (interval.current) {
          clearInterval(interval.current);
        }
      }

      setValue(_val);
    }, 2000);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <div className="card">
        <div className="flex justify-content-between align-items-center mb-2">
          <h3 className="-mt-1">{t("common.generalStatus")}</h3>
          <div>
            <Button
              className="mr-4"
              icon="pi pi-times"
              type="button"
              label={t("common.cancel")}
              severity="danger"
              style={{ height: 35 }}
            />
            <Chip
              label={
                value !== 100
                  ? `${t("common.downloading")}...`
                  : t("common.downloaded")
              }
              style={
                value !== 100
                  ? { background: "#22D3EE", color: "black", fontWeight: 700 }
                  : { background: "#4ADE80", color: "black", fontWeight: 700 }
              }
            />
          </div>
        </div>
        <ProgressBar value={value}></ProgressBar>
        <div className="text-center mt-2">
          <span>
            {value} / {totalFiles}{" "}
            {t("nexia.downloadDetails.processedFiles")}{" "}
          </span>
        </div>
      </div>

      <div className="card mt-4">
        <h3 className="-mt-1">{t("common.statistics")}</h3>

        <div className="flex gap-3 flex-wrap">
          {/* Descargados */}
          <div
            className="flex flex-column align-items-center justify-content-center text-white border-round-lg "
            style={{
              background: "linear-gradient(135deg, #2B8D7E, #3DEE78)",
              height: "110px",
              minWidth: "220px",
              flex: 1,
            }}
          >
            <span className="text-4xl font-bold">0</span>
            <span className="text-sm letter-spacing-1">DESCARGADOS</span>
          </div>

          {/* Ya existían */}
          <div
            className="flex flex-column align-items-center justify-content-center text-white border-round-lg "
            style={{
              background: "linear-gradient(135deg, #EF8CF8, #F55672)",
              height: "110px",
              minWidth: "220px",
              flex: 1,
            }}
          >
            <span className="text-4xl font-bold">0</span>
            <span className="text-sm letter-spacing-1">YA EXISTÍAN</span>
          </div>

          {/* Recuperados */}
          <div
            className="flex flex-column align-items-center justify-content-center text-white border-round-lg "
            style={{
              background: "linear-gradient(135deg, #48B1FE, #00F4FE)",
              height: "110px",
              minWidth: "220px",
              flex: 1,
            }}
          >
            <span className="text-4xl font-bold">0</span>
            <span className="text-sm letter-spacing-1">RECUPERADOS</span>
          </div>

          {/* Errores */}
          <div
            className="flex flex-column align-items-center justify-content-center text-white border-round-lg "
            style={{
              background: "linear-gradient(135deg, #F77494, #FAD84B)",
              height: "110px",
              minWidth: "220px",
              flex: 1,
            }}
          >
            <span className="text-4xl font-bold">0</span>
            <span className="text-sm letter-spacing-1">ERRORES</span>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h3 className="-mt-1">{t("common.detailedInfo")}</h3>
        <div className="grid">
          {/* Tiempo transcurrido */}
          <div className="col-12 md:col-6">
            <div className="card border-round-sm flex flex-column gap-1 p-2 min-h-4rem">
              <span className="text-sm text-color-secondary">
                {t("nexia.downloadDetails.timeElapsed")}
              </span>
              <span className="font-medium">0 minutos</span>
            </div>
          </div>

          {/* Velocidad promedio */}
          <div className="col-12 md:col-6">
            <div className="card border-round-sm flex flex-column gap-1 p-2 min-h-4rem">
              <span className="text-sm text-color-secondary">
                {t("nexia.downloadDetails.averageSpeed")}
              </span>
              <span className="font-medium">0 archivos/min</span>
            </div>
          </div>

          {/* Tiempo restante */}
          <div className="col-12 md:col-6">
            <div className="card border-round-sm flex flex-column gap-1 p-2 min-h-4rem">
              <span className="text-sm text-color-secondary">
                {t("nexia.downloadDetails.estimatedTimeRemaining")}
              </span>
              <span className="font-medium">0 minutos</span>
            </div>
          </div>

          {/* Tamaño total */}
          <div className="col-12 md:col-6">
            <div className="card border-round-sm flex flex-column gap-1 p-2 min-h-4rem">
              <span className="text-sm text-color-secondary">
                {t("nexia.downloadDetails.totalSizeDownloaded")}
              </span>
              <span className="font-medium">0.00 MB</span>
            </div>
          </div>

          {/* Último archivo */}
          <div className="col-12 md:col-6">
            <div className="card border-round-sm flex flex-column gap-1 p-2 min-h-4rem">
              <span className="text-sm text-color-secondary">
                {t("nexia.downloadDetails.lastFileDownloaded")}
              </span>
              <span className="font-medium">N/A</span>
            </div>
          </div>

          {/* Última actualización */}
          <div className="col-12 md:col-6">
            <div className="card border-round-sm flex flex-column gap-1 p-2 min-h-4rem">
              <span className="text-sm text-color-secondary">
                {t("nexia.downloadDetails.lastUpdate")}
              </span>
              <span className="font-medium">26/01/2026, 15:05:52 p.m.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
