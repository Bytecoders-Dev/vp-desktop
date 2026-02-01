export type Period = "day" | "week" | "month";

export type RecordItem = {
    createdAt: string | Date;
};

export type Point = { label: string; value: number };

// ------------------------
// Utils fechas (sin deps)
// ------------------------
function toDate(d: string | Date) {
    return d instanceof Date ? d : new Date(d);
}

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

function startOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function startOfWeek(d: Date) {
    // Semana iniciando en Lunes
    const date = startOfDay(d);
    const day = date.getDay(); // 0=Dom,1=Lun...
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    return date;
}

function startOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

function formatDayLabel(d: Date) {
    const names = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
    return `${names[d.getDay()]} ${pad2(d.getDate())}`;
}

function formatMonthLabel(d: Date) {
    const m = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    return `${m[d.getMonth()]} ${d.getFullYear()}`;
}

function formatWeekLabel(weekStart: Date) {
    const m = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `SEM ${pad2(weekStart.getDate())} ${m[weekStart.getMonth()]}`;
}

export function buildSeries(records: RecordItem[], period: Period): Point[] {
    const map = new Map<number, number>();

    for (const r of records) {
        const dt = toDate(r.createdAt);
        let keyDate: Date;

        if (period === "day") keyDate = startOfDay(dt);
        else if (period === "week") keyDate = startOfWeek(dt);
        else keyDate = startOfMonth(dt);

        const key = keyDate.getTime();
        map.set(key, (map.get(key) ?? 0) + 1);
    }

    const keys = Array.from(map.keys()).sort((a, b) => a - b);

    return keys.map((k) => {
        const d = new Date(k);
        const label =
            period === "day" ? formatDayLabel(d) : period === "week" ? formatWeekLabel(d) : formatMonthLabel(d);
        return { label, value: map.get(k) ?? 0 };
    });
}

// ------------------------
// SVG helpers
// ------------------------
export function smoothPath(points: { x: number; y: number }[]) {
    if (points.length < 2) return "";
    const d = [`M ${points[0].x} ${points[0].y}`];

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] ?? points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] ?? p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;

        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
    }

    return d.join(" ");
}

export function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}
