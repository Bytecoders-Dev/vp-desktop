import { useEffect, useRef } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { message } from "@tauri-apps/plugin-dialog";

type Options = {
    checkOnStart?: boolean;
    askBeforeInstall?: boolean;
};

export function useAutoUpdater(options: Options = {}) {
    const { checkOnStart = true, askBeforeInstall = true } = options;
    const ranRef = useRef(false);

    useEffect(() => {
        if (!checkOnStart) return;
        if (ranRef.current) return;
        ranRef.current = true;

        (async () => {
            try {
                const update = await check();

                await message(`check() => ${update ? JSON.stringify(update) : "null"}`, {
                    title: "Updater debug",
                    kind: "info",
                });

                if (!update) return;

                if (askBeforeInstall) {
                    const ok = window.confirm(
                        `Hay una actualización disponible.\n\nNueva versión: ${update.version}\n¿Deseas actualizar ahora?`
                    );
                    if (!ok) return;
                }

                await update.downloadAndInstall();
                await relaunch();
            } catch (err: any) {
                const msg =
                    typeof err === "string"
                        ? err
                        : err?.message || JSON.stringify(err);

                await message(msg, { title: "Updater ERROR", kind: "error" });
            }
        })();
    }, [checkOnStart, askBeforeInstall]);
}
