import { useState } from "react";
import { runManualUpdate } from "./update";
import { useTheme } from "../theme/theme.store";

export function UpdateButton() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (loading) return;
    setLoading(true);

    const res = await runManualUpdate({ askBeforeInstall: true });

    setLoading(false);

    if (res.status === "no-update") {
      alert("No hay actualizaciones disponibles.");
      return;
    }

    if (res.status === "cancelled") {
      // No molestamos al usuario
      return;
    }

    if (res.status === "error") {
      alert(`No se pudo buscar/instalar la actualización:\n\n${res.error}`);
      return;
    }
  };

  return (
    <button
      className="iconBtn"
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-label="Buscar actualizaciones"
      title="Buscar actualizaciones"
    >
      {theme === "dark" ? "🌎" : "🌎"}
    </button>
  );
}
