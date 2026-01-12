import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export type UpdateResult =
  | { status: "no-update" }
  | { status: "cancelled" }
  | { status: "updated" }
  | { status: "error"; error: string };

export async function runManualUpdate(options?: {
  askBeforeInstall?: boolean;
}): Promise<UpdateResult> {
  const askBeforeInstall = options?.askBeforeInstall ?? true;

  try {
    const update = await check();

    if (!update) return { status: "no-update" };

    if (askBeforeInstall) {
      const ok = window.confirm(
        `Hay una actualización disponible.\n\nNueva versión: ${update.version}\n¿Deseas actualizar ahora?`
      );
      if (!ok) return { status: "cancelled" };
    }

    await update.downloadAndInstall();
    await relaunch();

    return { status: "updated" };
  } catch (err: any) {
    const msg =
      typeof err === "string" ? err : err?.message ?? JSON.stringify(err);
    return { status: "error", error: msg };
  }
}
