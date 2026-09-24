"use client";
import { useEffect, useState } from "react";
import { Card } from "./ui";

export type Pace = { perWeek: number; eta: string | null } | null;

export default function GoalProgress({ start, current, goal, bmi, pace }: {
  start: number; current: number; goal: number; bmi: number; pace: Pace;
}) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 60); return () => clearTimeout(t); }, []);

  const pct = Math.min(1, Math.max(0, (start - current) / Math.max(0.1, start - goal)));
  const R = 72;
  const C = 2 * Math.PI * R;
  const lost = start - current;
  const togo = Math.max(0, current - goal);

  return (
    <Card>
      <div className="relative mx-auto h-48 w-48">
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0A84FF" />
              <stop offset="100%" stopColor="#30D158" />
            </linearGradient>
          </defs>
          <circle cx="90" cy="90" r={R} fill="none" stroke="#2c2c2e" strokeWidth="14" />
          <circle cx="90" cy="90" r={R} fill="none" stroke="url(#ring)" strokeWidth="14" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={on ? C * (1 - pct) : C}
            className="transition-[stroke-dashoffset] duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[40px] font-bold leading-none tracking-tight">{current.toFixed(1)}</div>
          <div className="mt-1 text-[13px] text-zinc-400">kg now</div>
          <div className="mt-2 rounded-full bg-[#30D158]/15 px-2.5 py-0.5 text-[12px] font-semibold text-[#30D158]">
            {Math.round(pct * 100)}% to goal
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 text-center">
        <div><div className="text-[20px] font-bold text-[#30D158]">{lost.toFixed(1)}</div><div className="text-[12px] text-zinc-400">kg lost</div></div>
        <div><div className="text-[20px] font-bold text-[#FF9F0A]">{togo.toFixed(1)}</div><div className="text-[12px] text-zinc-400">to {goal} kg</div></div>
        <div><div className="text-[20px] font-bold text-[#0A84FF]">{bmi.toFixed(1)}</div><div className="text-[12px] text-zinc-400">BMI</div></div>
      </div>

      <p className="mt-4 rounded-xl bg-[#2c2c2e] p-3 text-center text-[13px] text-zinc-300">
        {pace
          ? <>Recent pace <b className="text-white">{pace.perWeek <= 0 ? "" : "+"}{pace.perWeek.toFixed(2)} kg/week</b>
              {pace.eta && <> · goal around <b className="text-white">{pace.eta}</b> (estimate)</>}</>
          : "Keep logging. Your pace appears after about a week of weigh-ins."}
      </p>
    </Card>
  );
}
