import "i18next"

import en from "../i18n/locales/en.json"
import es from "../i18n/locales/es.json"

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: "es";
        resources: {
            es: typeof es;
            en: typeof en;
        };
    }
}