import { useEffect } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

type Options = {
    /**
     * Si true, revisa al iniciar la app.
     */
    checkOnStart?: boolean;

    /**
     * Si true, muestra confirmación (recomendado).
     * Si false, instala en automático si hay update.
     */
    askBeforeInstall?: boolean;
};

export function useAutoUpdater(options: Options = {}) {
    const { checkOnStart = true, askBeforeInstall = true } = options;

    useEffect(() => {
        if (!checkOnStart) return;

        (async () => {
            try {
                const update = await check();
                if (!update) return;

                if (askBeforeInstall) {
                    const ok = window.confirm(
                        `Hay una actualización disponible.\n\n` +
                        `Nueva versión: ${update.version}\n` +
                        `¿Deseas actualizar ahora?`
                    );
                    if (!ok) return;
                }

                await update.downloadAndInstall();

                await relaunch();
            } catch (err) {
                console.error("Updater error:", err);
            }
        })();
    }, [checkOnStart, askBeforeInstall]);
}
