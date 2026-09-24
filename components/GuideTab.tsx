"use client";
import { useState } from "react";
import { ChevronDown, IceCream, LifeBuoy, Repeat } from "lucide-react";
import { PLANS, SOS, SWAPS } from "@/lib/constants";
import { Card, Toggle } from "./ui";

export default function GuideTab() {
  const [day, setDay] = useState(0);
  const [gelato, setGelato] = useState(false);
  const [swaps, setSwaps] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<number | null>(null);
  const plan = PLANS[day];

  return (
    <>
      <h1 className="mb-5 text-[34px] font-bold">Guide</h1>

      <div className="mb-4 flex rounded-xl bg-[#1c1c1e] p-1">
        {PLANS.map((p, i) => (
          <button key={p.day} onClick={() => setDay(i)}
            className={`flex-1 rounded-lg py-1.5 text-[14px] font-semibold transition-colors ${day === i ? "bg-[#636366] text-white" : "text-zinc-400"}`}>
            Day {p.day}
          </button>
        ))}
      </div>

      <Card>
        {plan.meals.map(([name, items]) => (
          <div key={name} className="border-b border-white/10 py-2.5 last:border-0">
            <div className="text-[13px] text-zinc-400">{name}</div>
            <div className="text-[15px]">{items}</div>
          </div>
        ))}
        <div className="mt-2 rounded-xl bg-[#0A84FF]/15 p-3 text-[13px] font-medium text-[#64B5FF]">Total: {plan.total}</div>
      </Card>

      <Card title="Gelato tonight?" icon={<IceCream size={18} className="text-[#FF6482]" />}>
        <Toggle label="Having Gelato Tonight?" checked={gelato} onChange={setGelato} />
        {gelato && <p className="mt-1 rounded-xl bg-[#FF6482]/15 p-3 text-[14px] text-[#FF8FA3]">Remove dinner carb source and 1 Tbsp Oil.</p>}
      </Card>

      <Card title="Shift swaps" icon={<Repeat size={18} className="text-[#BF5AF2]" />}>
        {SWAPS.map((s) => (
          <div key={s.label}>
            <Toggle label={s.label} checked={!!swaps[s.label]} onChange={(v) => setSwaps({ ...swaps, [s.label]: v })} />
            {swaps[s.label] && <p className="mb-2 rounded-xl bg-[#BF5AF2]/15 p-3 text-[14px] text-[#D9A0F7]">{s.action}</p>}
          </div>
        ))}
      </Card>

      <Card title="Digestion SOS" icon={<LifeBuoy size={18} className="text-[#30D158]" />}>
        {SOS.map((s, i) => (
          <div key={s.title} className="border-b border-white/10 last:border-0">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between py-3 text-[15px]">
              {s.title}
              <ChevronDown size={18} className={`text-zinc-500 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="pb-3 text-[14px] leading-snug text-zinc-400">{s.body}</p>}
          </div>
        ))}
      </Card>
    </>
  );
}
