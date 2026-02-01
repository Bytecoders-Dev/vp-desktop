import { Button } from "primereact/button";
import { RefObject, useRef, useState } from "react";
import { Divider } from "primereact/divider";
import { useTranslation } from "react-i18next";
import { OverlayPanel } from "primereact/overlaypanel";
import { ListBox, ListBoxChangeEvent } from "primereact/listbox";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

interface timeBetweenDownloads {
  label: string;
  value: number;
}

export function ImmsCourtForm({
  showDialogForm,
  setDownloadInit,
}: {
  showDialogForm: RefObject<OverlayPanel | null>;
  setDownloadInit: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { t } = useTranslation();
  const [startOver, setStartOver] = useState(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<number>(2000);

  const toast = useRef<Toast>(null);

  const accept = () => {
    setDownloadInit(true);
    showDialogForm?.current?.hide();
  };

  const timeOptions: timeBetweenDownloads[] = [
    { label: "2000ms " + t("nexia.recommended"), value: 2000 },
    { label: "3000ms " + t("nexia.conservative"), value: 3000 },
    { label: "5000ms " + t("nexia.verySafe"), value: 5000 },
  ];

  const resetForm = () => {
    setStartOver(false);
    setChecked(false);
    setSelectedTime(2000);
    showDialogForm?.current?.hide();
  };

  const confirm1 = () => {
    confirmDialog({
      message: t("nexia.confirmationDownload.message"),
      header: t("nexia.confirmationDownload.header"),
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept,
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <div className="flex align-items-center">
          <RadioButton
            inputId="startOverFalse"
            name="startOver"
            value={false}
            onChange={(e: RadioButtonChangeEvent) => setStartOver(e.value)}
            checked={!startOver}
          />
          <label htmlFor="startOverFalse" className="ml-2">
            {t("nexia.startOver")}
          </label>
        </div>
        <div className="flex align-items-center">
          <RadioButton
            inputId="startOverTrue"
            name="startOver"
            value={true}
            onChange={(e: RadioButtonChangeEvent) => setStartOver(e.value)}
            checked={startOver}
          />
          <label htmlFor="startOverTrue" className="ml-2">
            {t("nexia.continueDownload")}
          </label>
        </div>
      </div>
      <Divider />
      <div className="mt-4">
        <div className="flex align-items-center mb-2">
          <label htmlFor="timeBetweenDownloads">
            {t("nexia.timeDownloadLabel")}
          </label>
        </div>
        <ListBox
          value={selectedTime}
          onChange={(e: ListBoxChangeEvent) => setSelectedTime(e.value)}
          options={timeOptions}
          optionLabel="label"
          className="w-full md:w-14rem"
        />
      </div>
      <Divider />
      <div className="mt-4 ">
        <label htmlFor="generateZip">{t("nexia.generateZip")}</label>
        <div className="flex align-items-center mt-2 gap-2">
          <span
            className="inline-flex justify-content-end -ml-2"
            style={{ minWidth: "2rem" }}
          >
            {checked ? t("common.yes") : t("common.no")}
          </span>

          <InputSwitch
            checked={checked}
            onChange={(e: InputSwitchChangeEvent) => setChecked(e.value)}
          />
        </div>
      </div>
      <div className="flex justify-content-between">
        <Button
          type="button"
          className="mt-4"
          severity="danger"
          style={{ height: 40 }}
          label={t("common.cancel")}
          onClick={resetForm}
        />
        <Button
          type="button"
          className="mt-4"
          style={{ height: 40 }}
          label={t("common.continue")}
          onClick={confirm1}
        />
      </div>
      <Toast ref={toast} />
      <ConfirmDialog />
    </>
  );
}
