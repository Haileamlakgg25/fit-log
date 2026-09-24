"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, Ban, Check, Cookie, Droplet, Dumbbell, Footprints, Hourglass, Moon, Save, Sun } from "lucide-react";
import { getLog, saveLog } from "@/lib/db";
import { Card, accent, btnCls, inputCls } from "./ui";
import MacroCalculator from "./MacroCalculator";

const CHECKS = [
  { label: "Fasted?", Icon: Moon },
  { label: "Peed?", Icon: Droplet },
  { label: "No water yet?", Icon: Ban },
];

// A softly tinted circle with a currentColor icon reads calmer than a solid filled square.
function IconBox({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: `${color}22`, color }}>
      {children}
    </span>
  );
}

function SwitchRow({ icon, color, label, checked, onChange }: {
  icon: ReactNode; color: string; label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 px-3 py-2.5 text-left">
      <IconBox color={color}>{icon}</IconBox>
      <span className="flex-1 text-[15px] text-white/85">{label}</span>
      <span className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors ${checked ? "bg-[#2FBFA6]" : "bg-white/[0.12]"}`}>
        <span className={`absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-[2px]"}`} />
      </span>
    </button>
  );
}

export default function TodayTab() {
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [checks, setChecks] = useState([false, false, false]);
  const [flags, setFlags] = useState({ ate_late_sugar: false, sore_legs: false, no_bathroom: false });
  const [status, setStatus] = useState("");
  const [saved, setSaved] = useState(false);
  const [hello, setHello] = useState("Hello");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    setHello(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
    setDateStr(new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }));
    getLog()
      .then((l) => {
        if (!l) return;
        setWeight(l.weight?.toString() ?? "");
        setSteps(l.steps ? String(l.steps) : "");
        setFlags({ ate_late_sugar: l.ate_late_sugar, sore_legs: l.sore_legs, no_bathroom: l.no_bathroom });
      })
      .catch(() => flash("Can't reach the database"));
  }, []);

  const flash = (m: string) => {
    setStatus(m);
    setTimeout(() => setStatus(""), 2500);
  };

  const saveWeighIn = async () => {
    const w = parseFloat(weight.replace(",", "."));
    if (isNaN(w)) return flash("Enter your weight first");
    try {
      await saveLog({ weight: w, ...flags });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      flash("Couldn't save weigh-in");
    }
  };

  const saveSteps = async () => {
    try {
      await saveLog({ steps: parseInt(steps) || 0 });
      flash("Steps saved");
    } catch {
      flash("Couldn't save steps");
    }
  };

  const anyFlag = Object.values(flags).some(Boolean);
  const ready = checks.every(Boolean);
  const s = parseInt(steps) || 0;
  const stepMsg =
    s >= 10000 ? "Goal smashed. Amazing day." :
    s >= 5000 ? `Green zone reached. ${(10000 - s).toLocaleString()} to the full goal.` :
    `${(5000 - s).toLocaleString()} steps to the green zone.`;

  return (
    <>
      <header className="mb-6">
        <p className="text-[13px] font-medium" style={{ color: accent.teal }} suppressHydrationWarning>{dateStr}</p>
        <h1 className="mt-1 text-[34px] font-bold leading-tight text-white" suppressHydrationWarning>{hello}, Faby</h1>
        <p className="text-[15px] text-white/40">Trust the deficit. One good day at a time.</p>
      </header>

      {status && (
        <div className="fixed left-1/2 top-[max(env(safe-area-inset-top),0.75rem)] z-50 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black shadow-lg">
          {status}
        </div>
      )}

      {/* Weigh-in hero — one accent (teal) carried through every element in this card */}
      <section className="mb-4 rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-[#2FBFA6]/[0.14] via-white/[0.03] to-white/[0.02] p-5 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBox color={accent.teal}><Sun size={18} /></IconBox>
            <h2 className="text-[17px] font-semibold text-white">Morning weigh-in</h2>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors ${ready ? "bg-[#2FBFA6]/15 text-[#6EE7B7]" : "bg-white/[0.06] text-white/35"}`}>
            {ready ? "Ready" : `${checks.filter(Boolean).length}/3`}
          </span>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {CHECKS.map(({ label, Icon }, i) => (
            <button key={label} onClick={() => setChecks(checks.map((v, j) => (j === i ? !v : v)))}
              className={`relative flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-[12px] font-medium transition-all active:scale-95 ${
                checks[i] ? "border-[#2FBFA6]/40 bg-[#2FBFA6]/[0.12] text-[#6EE7B7]" : "border-white/[0.05] bg-black/[0.18] text-white/40"
              }`}>
              {checks[i] && <Check size={12} strokeWidth={3} className="absolute right-2 top-2" />}
              <Icon size={22} />
              {label}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-baseline justify-center gap-2 rounded-[24px] bg-black/[0.18] py-4">
          <input inputMode="decimal" placeholder="00.0" value={weight} onChange={(e) => setWeight(e.target.value)}
            className="w-44 bg-transparent text-center text-[56px] font-bold leading-none tracking-tight text-white placeholder-white/15 outline-none" />
          <span className="text-[20px] font-semibold text-white/30">kg</span>
        </div>

        <p className="mb-2 px-1 text-[13px] text-white/45">How does your body feel?</p>
        <div className="divide-y divide-white/[0.06] overflow-hidden rounded-[24px] bg-black/[0.18]">
          <SwitchRow icon={<Cookie size={18} />} color={accent.amber} label="Ate late sugar?" checked={flags.ate_late_sugar}
            onChange={(v) => setFlags({ ...flags, ate_late_sugar: v })} />
          <SwitchRow icon={<Dumbbell size={18} />} color={accent.violet} label="Sore legs?" checked={flags.sore_legs}
            onChange={(v) => setFlags({ ...flags, sore_legs: v })} />
          <SwitchRow icon={<Hourglass size={18} />} color={accent.violet} label="Haven't used bathroom?" checked={flags.no_bathroom}
            onChange={(v) => setFlags({ ...flags, no_bathroom: v })} />
        </div>

        <div className={`grid transition-all duration-300 ${anyFlag ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <div className="flex gap-3 rounded-2xl border border-[#D6A465]/25 bg-gradient-to-r from-[#D6A465]/[0.14] to-[#D6A465]/[0.03] p-3.5 text-[14px] leading-snug text-[#E3BE8C]">
              <AlertTriangle size={20} className="mt-0.5 shrink-0" />
              <p>Reminder: You are holding water weight or physical waste today. This is NOT fat. Trust the deficit.</p>
            </div>
          </div>
        </div>

        <button onClick={saveWeighIn}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[16px] font-semibold text-[#06231C] transition-colors active:opacity-70 ${
            saved ? "bg-[#6EE7B7]" : "bg-gradient-to-r from-[#2FBFA6] to-[#6EE7B7]"
          }`}>
          {saved ? <><Check size={18} strokeWidth={3} /> Saved</> : <><Save size={18} /> Save weigh-in</>}
        </button>
      </section>

      {/* Steps — same teal family, quieter card */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBox color={accent.teal}><Footprints size={18} /></IconBox>
            <h2 className="text-[17px] font-semibold text-white">Steps</h2>
          </div>
          <div className="text-right">
            <span className="text-[26px] font-bold text-white">{s.toLocaleString()}</span>
            <span className="text-[13px] text-white/35"> / 10,000</span>
          </div>
        </div>

        <div className="relative h-[18px] overflow-hidden rounded-full bg-white/[0.10]">
          <div className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.min(100, (s / 10000) * 100)}%`,
              background: s >= 5000 ? `linear-gradient(90deg, ${accent.teal}, ${accent.mint})` : `linear-gradient(90deg, #8A6B45, ${accent.amber})`,
            }} />
          <div className="absolute left-1/2 top-0 h-full w-px bg-white/20" />
        </div>
        <div className="mt-1.5 flex justify-between text-[12px] text-white/35">
          <span>0</span>
          <span className={`flex items-center gap-1 ${s >= 5000 ? "font-semibold text-[#6EE7B7]" : ""}`}>
            {s >= 5000 && <Check size={12} strokeWidth={3} />}5,000
          </span>
          <span>10,000</span>
        </div>
        <p className="mt-3 text-[13px] text-white/45">{stepMsg}</p>

        <div className="mt-3 flex gap-2">
          <input className={inputCls} inputMode="numeric" placeholder="Today's steps" value={steps} onChange={(e) => setSteps(e.target.value)} />
          <button className={btnCls} onClick={saveSteps}><Save size={18} /></button>
        </div>
      </Card>

      <MacroCalculator />
    </>
  );
}
