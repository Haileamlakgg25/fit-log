"use client";
import type { ReactNode } from "react";

// Shared design tokens — one calm palette used everywhere: teal for tracking/progress,
// muted violet for nutrition, muted amber reserved for warnings only.
export const accent = {
  teal: "#2FBFA6",
  mint: "#6EE7B7",
  violet: "#9C90DD",
  amber: "#D6A465",
  rose: "#E08585",
};

export function Card({ title, icon, children }: { title?: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-4 rounded-[28px] border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur-xl">
      {title && (
        <h2 className="mb-3 flex items-center gap-2.5 text-[16px] font-semibold text-white/90">
          {icon}
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between py-2 text-left">
      <span className="pr-3 text-[15px] text-white/85">{label}</span>
      <span className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors ${checked ? "bg-[#2FBFA6]" : "bg-white/[0.12]"}`}>
        <span className={`absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-[2px]"}`} />
      </span>
    </button>
  );
}

// Under target: quiet teal, still climbing. In range: bright mint, goal met. Over: muted rose, never harsh red.
export function Bar({ label, value, min, max, unit }: { label: string; value: number; min: number; max: number; unit: string }) {
  const over = value > max;
  const inRange = value >= min && value <= max;
  const gradient = over
    ? `linear-gradient(90deg, #B96868, ${accent.rose})`
    : inRange
    ? `linear-gradient(90deg, ${accent.teal}, ${accent.mint})`
    : `linear-gradient(90deg, #2A5A50, ${accent.teal})`;
  const valueColor = over ? accent.rose : inRange ? accent.mint : accent.teal;

  return (
    <div className="mb-3.5 last:mb-0">
      <div className="mb-1.5 flex justify-between text-[13px]">
        <span className="font-medium text-white/70">{label}</span>
        <span className="text-white/40">
          <span style={{ color: valueColor }} className="font-semibold">{Math.round(value)}</span> / {min}–{max}{unit}
        </span>
      </div>
      <div className="relative h-3.5 overflow-hidden rounded-full bg-white/[0.10]">
        <div className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: gradient }} />
        <div className="absolute top-0 h-full w-px bg-white/25" style={{ left: `${(min / max) * 100}%` }} />
      </div>
    </div>
  );
}

export const inputCls =
  "w-full rounded-2xl border border-white/[0.06] bg-white/[0.06] px-3.5 py-2.5 text-[16px] text-white placeholder-white/30 outline-none transition-colors focus:border-white/[0.14] focus:bg-white/[0.09]";

export const btnCls =
  "flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2FBFA6] to-[#6EE7B7] px-4 py-2.5 text-[15px] font-semibold text-[#06231C] active:opacity-70 disabled:opacity-40";
