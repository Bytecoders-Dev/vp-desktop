import { useTranslation } from "react-i18next";
import { ImmsCourtDownloadDetails } from "./components/immsCourtDownloadDetails";

export function ImmsCourtDownloadDetailsView() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex justify-content-between align-items-center mb-4 mx-1">
        <div>
          <h2 style={{ margin: "0 0 8px" }}>
            {t("nexia.immsCourt.downloadDetails")}
          </h2>
        </div>
      </div>
      <ImmsCourtDownloadDetails />
    </div>
  );
}
