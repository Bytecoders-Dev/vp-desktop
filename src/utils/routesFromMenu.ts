import { MenuOption } from "../components/layout/menuOptions";

export type AppRoute = {
    path: string;
    element: React.ComponentType;
};

export function routesFromMenu(items: MenuOption[]): AppRoute[] {
    const out: AppRoute[] = [];

    const walk = (list: MenuOption[]) => {
        for (const item of list) {
            if (item.path && item.element) {
                out.push({ path: item.path, element: item.element });
            }
            if (item.children?.length) walk(item.children);
        }
    };

    walk(items);
    return out;
}
