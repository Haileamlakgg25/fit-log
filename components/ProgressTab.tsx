"use client";
import { useEffect, useState } from "react";
import { Droplets } from "lucide-react";
import { getLogs } from "@/lib/db";
import { DEFAULT_PROFILE } from "@/lib/constants";
import { useLocalStorage } from "@/lib/useLocalStorage";
import type { DailyLog, Profile } from "@/lib/types";
import { Card } from "./ui";
import GoalProgress, { type Pace } from "./GoalProgress";
import WeightChart from "./WeightChart";

// Least-squares slope over the last 14 days of weigh-ins (more stable than first-vs-last)
function getPace(weighed: DailyLog[], remaining: number): Pace {
  const cut = new Date();
  cut.setDate(cut.getDate() - 14);
  const c = cut.toLocaleDateString("en-CA");
  const r = weighed.filter((l) => l.log_date >= c);
  if (r.length < 3) return null;
  const t0 = new Date(r[0].log_date).getTime();
  const pts = r.map((l) => [(new Date(l.log_date).getTime() - t0) / 86400000, Number(l.weight)]);
  if (pts[pts.length - 1][0] < 5) return null;
  const n = pts.length;
  const sx = pts.reduce((s, p) => s + p[0], 0);
  const sy = pts.reduce((s, p) => s + p[1], 0);
  const sxy = pts.reduce((s, p) => s + p[0] * p[1], 0);
  const sxx = pts.reduce((s, p) => s + p[0] * p[0], 0);
  const perWeek = ((n * sxy - sx * sy) / (n * sxx - sx * sx)) * 7;
  let eta: string | null = null;
  if (perWeek < -0.05 && remaining > 0) {
    const d = new Date();
    d.setDate(d.getDate() + Math.ceil((remaining / -perWeek) * 7));
    eta = d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }
  return { perWeek, eta };
}

export default function ProgressTab() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [profile] = useLocalStorage<Profile>("profile", DEFAULT_PROFILE);

  useEffect(() => { getLogs().then(setLogs).catch(console.error); }, []);

  const weighed = logs.filter((l) => l.weight != null);
  const current = weighed.length ? Number(weighed[weighed.length - 1].weight) : profile.startWeight;
  const bmi = current / Math.pow(profile.height / 100, 2);
  const last7 = logs.slice(-7).reverse();

  return (
    <>
      <h1 className="mb-5 text-[34px] font-bold">Progress</h1>

      <GoalProgress start={profile.startWeight} current={current} goal={profile.goalWeight} bmi={bmi}
        pace={getPace(weighed, Math.max(0, current - profile.goalWeight))} />

      <WeightChart logs={logs} goal={profile.goalWeight} />

      <Card title="Last 7 days">
        <table className="w-full text-left text-[14px]">
          <thead className="text-[12px] text-zinc-500">
            <tr><th className="pb-2 font-medium">Date</th><th className="font-medium">Weight</th><th className="font-medium">Steps</th><th /></tr>
          </thead>
          <tbody>
            {last7.map((l) => (
              <tr key={l.id} className="border-t border-white/10">
                <td className="py-2">{l.log_date.slice(5)}</td>
                <td>{l.weight ?? "–"}</td>
                <td className={l.steps >= 5000 ? "text-[#30D158]" : ""}>{l.steps.toLocaleString()}</td>
                <td className="text-right">
                  {(l.ate_late_sugar || l.sore_legs || l.no_bathroom) && <Droplets size={16} className="inline text-[#FF9F0A]" />}
                </td>
              </tr>
            ))}
            {!last7.length && <tr><td colSpan={4} className="py-4 text-center text-zinc-500">No entries yet.</td></tr>}
          </tbody>
        </table>
        <p className="mt-2 text-[12px] text-zinc-500">
          <Droplets size={12} className="mr-1 inline text-[#FF9F0A]" />
          Water-retention or bathroom flag that day
        </p>
      </Card>
    </>
  );
}
