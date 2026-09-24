"use client";
import { useMemo, useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { DailyLog } from "@/lib/types";
import { Card } from "./ui";

const RANGES = [{ id: "7D", days: 7 }, { id: "30D", days: 30 }, { id: "All", days: 100000 }] as const;
type Point = { date: string; label: string; weight: number; trend: number };

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function Tip({ active, payload }: { active?: boolean; payload?: { payload: Point }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl bg-[#2c2c2e]/95 px-3 py-2 shadow-xl backdrop-blur">
      <div className="text-[12px] text-zinc-400">{d.label}</div>
      <div className="text-[17px] font-bold">{d.weight.toFixed(1)} kg</div>
      <div className="text-[12px] text-[#64D2FF]">Trend {d.trend.toFixed(1)}</div>
    </div>
  );
}

export default function WeightChart({ logs, goal }: { logs: DailyLog[]; goal: number }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("30D");

  // Trend = average of the last 7 weigh-ins, so one salty dinner doesn't move the line.
  const all = useMemo<Point[]>(() => {
    const w = logs.filter((l) => l.weight != null);
    return w.map((l, i) => {
      const win = w.slice(Math.max(0, i - 6), i + 1);
      const trend = win.reduce((s, x) => s + Number(x.weight), 0) / win.length;
      return { date: l.log_date, label: fmt(l.log_date), weight: Number(l.weight), trend: Math.round(trend * 100) / 100 };
    });
  }, [logs]);

  const data = useMemo(() => {
    const days = RANGES.find((r) => r.id === range)!.days;
    const cut = new Date();
    cut.setDate(cut.getDate() - days);
    const c = cut.toLocaleDateString("en-CA");
    return all.filter((d) => d.date >= c);
  }, [all, range]);

  const latest = data[data.length - 1];
  const delta = data.length >= 2 ? latest.weight - data[0].weight : 0;
  const lowest = data.length ? Math.min(...data.map((d) => d.weight)) : 0;
  const DeltaIcon = delta < -0.05 ? ArrowDownRight : delta > 0.05 ? ArrowUpRight : Minus;
  const deltaColor = delta <= 0.05 ? "#30D158" : "#FF9F0A";

  return (
    <Card>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-[13px] text-zinc-400">Weight trend</div>
          {latest && (
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-[28px] font-bold leading-none">{latest.weight.toFixed(1)}</span>
              <span className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[12px] font-semibold"
                style={{ color: deltaColor, background: deltaColor + "26" }}>
                <DeltaIcon size={14} />{Math.abs(delta).toFixed(1)} kg
              </span>
            </div>
          )}
          {latest && <div className="mt-1 text-[12px] text-zinc-500">Lowest {lowest.toFixed(1)} kg</div>}
        </div>
        <div className="flex rounded-lg bg-[#2c2c2e] p-0.5">
          {RANGES.map((r) => (
            <button key={r.id} onClick={() => setRange(r.id)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-semibold transition-colors ${range === r.id ? "bg-[#636366] text-white" : "text-zinc-400"}`}>
              {r.id}
            </button>
          ))}
        </div>
      </div>

      {data.length < 2 ? (
        <p className="py-16 text-center text-[14px] text-zinc-500">Log at least 2 weigh-ins in this range to see your trend.</p>
      ) : (
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="wFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0A84FF" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#0A84FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="wStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0A84FF" />
                  <stop offset="100%" stopColor="#30D158" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ffffff12" vertical={false} />
              <XAxis dataKey="label" stroke="#8e8e93" fontSize={11} tickLine={false} axisLine={false}
                interval="preserveStartEnd" minTickGap={28} />
              <YAxis stroke="#8e8e93" fontSize={11} tickLine={false} axisLine={false}
                domain={[(min: number) => Math.floor(min - 1), (max: number) => Math.ceil(max + 1)]} />
              <Tooltip content={<Tip />} cursor={{ stroke: "#ffffff30" }} />
              <ReferenceLine y={goal} stroke="#30D158" strokeDasharray="5 5"
                label={{ value: `Goal ${goal}`, fill: "#30D158", fontSize: 11, position: "insideBottomRight" }} />
              <Area type="monotone" dataKey="trend" stroke="url(#wStroke)" strokeWidth={3} fill="url(#wFill)" />
              <Line type="monotone" dataKey="weight" stroke="transparent"
                dot={{ r: 3.5, fill: "#fff", stroke: "#0A84FF", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#fff" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
      <p className="mt-2 text-[12px] leading-snug text-zinc-500">
        Dots are daily weigh-ins. The line is your smoothed trend, which ignores water-weight bumps. The goal line shows once you're close enough to see it.
      </p>
    </Card>
  );
}
