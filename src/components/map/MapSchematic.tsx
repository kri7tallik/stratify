import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Callout, CsMap, GrenadeType } from "@/types/content";
import { cn } from "@/lib/cn";

export interface Trajectory {
  id: string;
  from: string;
  to: string;
  type: GrenadeType;
  active?: boolean;
}

interface Props {
  map: CsMap;
  highlight?: string[];
  routePath?: string[];
  routeColor?: string;
  trajectories?: Trajectory[];
  selectedCallout?: string | null;
  onCalloutClick?(c: Callout): void;
  onTrajectoryClick?(id: string): void;
  /** focus: labels only for highlighted / hovered callouts (default) */
  labels?: "all" | "focus" | "none";
  /** hide callout dots entirely (thumbnails) */
  dots?: boolean;
  className?: string;
}

export const NADE_COLOR: Record<GrenadeType, string> = {
  smoke: "#e6e9ee",
  flash: "#f5e27a",
  molotov: "#ff6a1a",
  he: "#3fcf8e",
};

export const radarUrl = (id: string) => `/radars/${id}.webp`;

/** Official CS2 radar overview with callout markers and grenade trajectories on top. */
export function MapSchematic({
  map,
  highlight = [],
  routePath,
  routeColor = "#ff6a1a",
  trajectories = [],
  selectedCallout,
  onCalloutClick,
  onTrajectoryClick,
  labels = "focus",
  dots = true,
  className,
}: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const byId = useMemo(() => Object.fromEntries(map.callouts.map((c) => [c.id, c])), [map]);
  const hl = new Set(highlight);
  const routePts = (routePath ?? []).map((id) => byId[id]).filter(Boolean);

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-[#0d0e11]", className)}>
      <svg viewBox="0 0 100 100" className="block h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id={`arrow-${map.id}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="context-stroke" />
          </marker>
        </defs>
        <image href={radarUrl(map.id)} x="0" y="0" width="100" height="100" />

        {routePts.length > 1 && (
          <motion.polyline
            key={routePath?.join("-")}
            points={routePts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={routeColor}
            strokeWidth={0.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd={`url(#arrow-${map.id})`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}

        {trajectories.map((t) => {
          const p = byId[t.from];
          const q = byId[t.to];
          if (!p || !q) return null;
          const mx = (p.x + q.x) / 2;
          const my = (p.y + q.y) / 2 - Math.max(4, Math.hypot(q.x - p.x, q.y - p.y) * 0.2);
          const color = NADE_COLOR[t.type];
          const d = `M${p.x},${p.y} Q${mx},${my} ${q.x},${q.y}`;
          return (
            <g key={t.id} className={onTrajectoryClick ? "cursor-pointer" : undefined} onClick={() => onTrajectoryClick?.(t.id)} opacity={t.active === false ? 0.2 : 1}>
              <path d={d} fill="none" stroke="transparent" strokeWidth={3} />
              <path d={d} fill="none" stroke="#000" strokeOpacity={0.5} strokeWidth={0.9} />
              <path d={d} fill="none" stroke={color} strokeWidth={0.45} strokeDasharray="1.2 0.8" strokeLinecap="round" />
              <circle cx={p.x} cy={p.y} r={0.9} fill="#0d0e11" stroke={color} strokeWidth={0.4} />
              <circle cx={q.x} cy={q.y} r={t.type === "smoke" ? 2.6 : 1.8} fill={color} fillOpacity={0.35} stroke={color} strokeWidth={0.3} />
            </g>
          );
        })}

        {dots &&
          map.callouts.map((c) => {
            const on = hl.has(c.id) || selectedCallout === c.id;
            const show = labels === "all" || (labels === "focus" && (on || hover === c.id));
            return (
              <g
                key={c.id}
                className={cn(onCalloutClick && "cursor-pointer")}
                onClick={() => onCalloutClick?.(c)}
                onMouseEnter={() => setHover(c.id)}
                onMouseLeave={() => setHover((h) => (h === c.id ? null : h))}
              >
                <circle cx={c.x} cy={c.y} r={3} fill="transparent" />
                {on && <motion.circle cx={c.x} cy={c.y} r={2.6} fill="#ff6a1a" initial={{ opacity: 0 }} animate={{ opacity: [0.35, 0.1, 0.35] }} transition={{ repeat: Infinity, duration: 1.8 }} />}
                <circle cx={c.x} cy={c.y} r={on ? 1.1 : 0.7} fill={on ? "#ff6a1a" : "#ffffff"} fillOpacity={on ? 1 : 0.55} stroke="#0d0e11" strokeWidth={0.3} />
                {show && (
                  <text x={c.x} y={c.y - 2} textAnchor="middle" fontSize="2.3" fontWeight={600} fill="#fff" style={{ paintOrder: "stroke", stroke: "#0d0e11", strokeWidth: 0.9 }}>
                    {c.name}
                  </text>
                )}
              </g>
            );
          })}
      </svg>
    </div>
  );
}
