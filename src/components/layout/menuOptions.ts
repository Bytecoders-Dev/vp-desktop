import type React from "react";
import type { TFunction } from "i18next";
import { HomePage } from "../../app/home/HomePage";
import { ProjectsPage } from "../../app/projects/ProjectsPage";
import { ImmsCourtPage } from "../../app/nexia/ImmsCourtPage";
import { ImmsCourtDownloadDetailsPage } from "../../app/nexia/ImmsCourtDownloadDetailsPage";


type TranslationKey = Parameters<TFunction>[0];

export type MenuOption = {
    key: string;
    i18nKey: TranslationKey;
    icon: string;
    path?: string;
    element?: React.ComponentType;
    children?: MenuOption[];
};

export const menuOptions: MenuOption[] = [
    { key: "home", i18nKey: "sidebar.items.home", icon: "🏠", path: "/home", element: HomePage },
    { key: "projects", i18nKey: "sidebar.items.projects", icon: "📁", path: "/projects", element: ProjectsPage },
    {
        key: "nexia",
        i18nKey: "sidebar.items.nexia",
        icon: "📁",
        children: [
            {
                key: "estradosImms",
                i18nKey: "sidebar.items.estradosImms",
                icon: "📄",
                path: "/nexia/estrados-imms",
                element: ImmsCourtPage,
            },
            {
                key: "immsCourtDownloadDetails",
                i18nKey: "nexia.immsCourt.downloadDetails",
                icon: "📄",
                path: "/nexia/imms-court-download-details",
                element: ImmsCourtDownloadDetailsPage,
            },
        ],
    },
    {
        key: "settings",
        i18nKey: "sidebar.items.tools",
        icon: "⚙️",
        children: [
            { key: "general", i18nKey: "sidebar.items.general", icon: "🔧", path: "#" },
            { key: "security", i18nKey: "sidebar.items.security", icon: "🔒", path: "#" },
        ],
    },
];
