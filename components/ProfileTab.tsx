"use client";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { DEFAULT_PROFILE } from "@/lib/constants";
import { useLocalStorage } from "@/lib/useLocalStorage";
import type { Profile } from "@/lib/types";
import { Card, btnCls, inputCls } from "./ui";

export default function ProfileTab() {
  const [p, setP] = useLocalStorage<Profile>("profile", DEFAULT_PROFILE);
  const [f, setF] = useState({ height: "", startWeight: "", goalWeight: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setF({ height: String(p.height), startWeight: String(p.startWeight), goalWeight: String(p.goalWeight) });
  }, [p]);

  const save = () => {
    const n = (v: string) => parseFloat(v.replace(",", "."));
    const next = { height: n(f.height), startWeight: n(f.startWeight), goalWeight: n(f.goalWeight) };
    if (Object.values(next).some(isNaN)) return;
    setP(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { key: "height", label: "Height (cm)" },
    { key: "startWeight", label: "Starting weight (kg)" },
    { key: "goalWeight", label: "Goal weight (kg)" },
  ] as const;

  return (
    <>
      <h1 className="mb-5 text-[34px] font-bold">Profile</h1>
      <Card>
        {fields.map(({ key, label }) => (
          <label key={key} className="mb-3 block">
            <span className="mb-1 block text-[13px] text-zinc-400">{label}</span>
            <input className={inputCls} inputMode="decimal" value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })} />
          </label>
        ))}
        <button className={`${btnCls} w-full`} onClick={save}>
          <Save size={18} /> {saved ? "Saved" : "Save profile"}
        </button>
      </Card>
    </>
  );
}
