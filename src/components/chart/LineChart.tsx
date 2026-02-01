import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles/lineChart.css";

import type { Period, Point, RecordItem } from "./utils/lineChart.utils";
import { buildSeries, easeOutCubic, smoothPath } from "./utils/lineChart.utils";

function InnerChart({
  data,
  height = 280,
  durationMs = 450,
}: {
  data: Point[];
  height?: number;
  durationMs?: number;
}) {
  const width = 1000; // viewBox
  const padding = { top: 18, right: 24, bottom: 40, left: 28 };

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);

  const [animatedValues, setAnimatedValues] = useState<number[]>(() =>
    data.map((d) => d.value),
  );
  const prevValuesRef = useRef<number[]>(data.map((d) => d.value));

  useEffect(() => {
    const next = data.map((d) => d.value);
    const prev = prevValuesRef.current;

    const maxLen = Math.max(prev.length, next.length);
    const prevPad = Array.from(
      { length: maxLen },
      (_, i) => prev[i] ?? prev[prev.length - 1] ?? 0,
    );
    const nextPad = Array.from(
      { length: maxLen },
      (_, i) => next[i] ?? next[next.length - 1] ?? 0,
    );

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const e = easeOutCubic(t);

      const vals = prevPad.map((p, i) => p + (nextPad[i] - p) * e);
      setAnimatedValues(vals.slice(0, next.length));

      if (t < 1) raf = requestAnimationFrame(tick);
      else prevValuesRef.current = next;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [data, durationMs]);

  const max = Math.max(1, ...animatedValues, ...data.map((d) => d.value));
  const min = 0;

  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const x = (i: number) =>
    padding.left + (data.length <= 1 ? 0 : (i * innerW) / (data.length - 1));

  const y = (v: number) =>
    padding.top + innerH - ((v - min) * innerH) / (max - min);

  const points = useMemo(
    () =>
      data.map((p, i) => ({
        x: x(i),
        y: y(animatedValues[i] ?? p.value),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, animatedValues, max],
  );

  const linePath = useMemo(() => smoothPath(points), [points]);
  const areaPath = useMemo(() => {
    if (!linePath || points.length === 0) return "";
    return `${linePath} L ${points[points.length - 1].x} ${padding.top + innerH} L ${points[0].x} ${
      padding.top + innerH
    } Z`;
  }, [linePath, points, innerH, padding.top]);

  const gridYs = [0.25, 0.5, 0.75].map((t) => padding.top + innerH * t);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!wrapRef.current || data.length === 0) return;

    const rect = wrapRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;

    const vx = (mx / rect.width) * width;

    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < points.length; i++) {
      const dist = Math.abs(points[i].x - vx);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }

    setHoverIdx(best);

    const px = (points[best].x / width) * rect.width;
    const py = (points[best].y / height) * rect.height;

    setTooltip({ x: px, y: py });
  }

  function onLeave() {
    setHoverIdx(null);
    setTooltip(null);
  }

  return (
    <div className="lcChartWrap" ref={wrapRef} style={{ position: "relative" }}>
      {hoverIdx !== null && tooltip && (
        <div
          className="lcTooltip"
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -110%)",
            pointerEvents: "none",
          }}
        >
          <div className="lcTooltipLabel">{data[hoverIdx].label}</div>
          <div className="lcTooltipValue">
            {data[hoverIdx].value.toLocaleString()} registros
          </div>
        </div>
      )}

      <svg
        className="lcChart"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Tendencia de registros"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <defs>
          {/* Mantengo tu gradiente. Solo renombro el id por consistencia */}
          <linearGradient id="lcArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {gridYs.map((gy, idx) => (
          <line
            key={idx}
            x1={padding.left}
            x2={width - padding.right}
            y1={gy}
            y2={gy}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        <path d={areaPath} fill="url(#lcArea)" />

        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {data.map((_, i) => {
          const isActive = i === hoverIdx;
          return (
            <g key={i}>
              <circle
                cx={points[i]?.x ?? 0}
                cy={points[i]?.y ?? 0}
                r="10"
                fill="transparent"
              />
              <circle
                cx={points[i]?.x ?? 0}
                cy={points[i]?.y ?? 0}
                r={isActive ? 6 : 3.5}
                fill="var(--accent)"
                opacity={isActive ? 1 : 0.95}
              />
              {isActive && (
                <circle
                  cx={points[i]?.x ?? 0}
                  cy={points[i]?.y ?? 0}
                  r="10"
                  fill="rgba(30,136,255,0.18)"
                />
              )}
            </g>
          );
        })}

        {data.map((p, i) => (
          <text
            key={i}
            x={
              padding.left +
              (data.length <= 1
                ? 0
                : (i * (width - padding.left - padding.right)) /
                  (data.length - 1))
            }
            y={padding.top + innerH + 24}
            textAnchor={
              i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"
            }
            fontSize="12"
            fill="rgba(255,255,255,0.55)"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ------------------------
// Componente exportable
// ------------------------
export type LineChartProps = {
  records: RecordItem[];
  defaultPeriod?: Period;
  title?: string;
  subtitle?: string;
  titleInChart?: string;
};

export function LineChart({
  records,
  defaultPeriod = "week",
  title,
  subtitle,
}: LineChartProps) {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>(defaultPeriod);

  const series = useMemo(() => buildSeries(records, period), [records, period]);
  const total = records.length;

  return (
    <div className="lcPanel">
      <div className="lcHeader">
        <div>
          <h3 className="lcTitle">{title}</h3>
          <p className="lcSubtitle">{subtitle}</p>
        </div>

        <div className="lcSwitch" role="tablist" aria-label="Periodo">
          <button
            className={`lcSwitchBtn ${period === "day" ? "isActive" : ""}`}
            onClick={() => setPeriod("day")}
          >
            {t("common.day", { defaultValue: "Día" })}
          </button>
          <button
            className={`lcSwitchBtn ${period === "week" ? "isActive" : ""}`}
            onClick={() => setPeriod("week")}
          >
            {t("common.week", { defaultValue: "Semana" })}
          </button>
          <button
            className={`lcSwitchBtn ${period === "month" ? "isActive" : ""}`}
            onClick={() => setPeriod("month")}
          >
            {t("common.month", { defaultValue: "Mes" })}
          </button>
        </div>
      </div>

      <div className="lcCard">
        <div className="lcCardTop">
          <div>
            <h4 className="lcCardTitle">
              {t("pages.nexia.titleInChart", {
                defaultValue: "Tendencia de Registros",
              })}
            </h4>
            <p className="lcMuted">
              {t("pages.nexia.estradosImms.total", { defaultValue: "Total" })}:{" "}
              <span className="lcStrong">{total.toLocaleString()}</span>
            </p>
          </div>

          <div className="lcLegend">
            <span className="lcDot" />
            <span className="lcMuted">
              {t("common.currentPeriod", { defaultValue: "Periodo Actual" })}
            </span>
          </div>
        </div>

        <InnerChart data={series} />
      </div>
    </div>
  );
}
