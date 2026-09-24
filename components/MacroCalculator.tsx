"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, Trash2, Utensils } from "lucide-react";
import { addFood, deleteFood, getFoods, todayISO } from "@/lib/db";
import { TARGETS } from "@/lib/constants";
import { useLocalStorage } from "@/lib/useLocalStorage";
import type { Food, MealEntry, MealName } from "@/lib/types";
import { Bar, Card, accent, btnCls, inputCls } from "./ui";

const MEALS: MealName[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function MacroCalculator() {
  const [date] = useState(todayISO);
  const [foods, setFoods] = useState<Food[]>([]);
  // Meal entries live on this device, keyed by day. Foods live in Supabase.
  const [entries, setEntries] = useLocalStorage<MealEntry[]>(`macros:${date}`, []);
  const [draft, setDraft] = useState<Record<string, { foodId: string; grams: string }>>({});
  const [showFoods, setShowFoods] = useState(false);
  const [nf, setNf] = useState({ name: "", kcal: "", p: "", c: "", f: "" });

  const refresh = () => getFoods().then(setFoods).catch(console.error);
  useEffect(() => { refresh(); }, []);

  const byId = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);

  const calc = (e: MealEntry) => {
    const f = byId.get(e.foodId);
    const k = f ? e.grams / 100 : 0;
    return {
      kcal: (f?.calories_per_100g ?? 0) * k,
      p: (f?.protein_per_100g ?? 0) * k,
      c: (f?.carbs_per_100g ?? 0) * k,
      f: (f?.fats_per_100g ?? 0) * k,
    };
  };

  const total = entries.reduce(
    (t, e) => {
      const m = calc(e);
      return { kcal: t.kcal + m.kcal, p: t.p + m.p, c: t.c + m.c, f: t.f + m.f };
    },
    { kcal: 0, p: 0, c: 0, f: 0 }
  );

  const add = (meal: MealName) => {
    const d = draft[meal];
    const grams = parseFloat(d?.grams);
    if (!d?.foodId || !grams) return;
    setEntries([...entries, { id: crypto.randomUUID(), meal, foodId: Number(d.foodId), grams }]);
    setDraft({ ...draft, [meal]: { foodId: d.foodId, grams: "" } });
  };

  const createFood = async () => {
    const n = (v: string) => parseFloat(v.replace(",", ".")) || 0;
    if (!nf.name.trim() || !nf.kcal) return;
    await addFood({
      name: nf.name.trim(),
      calories_per_100g: n(nf.kcal),
      protein_per_100g: n(nf.p),
      carbs_per_100g: n(nf.c),
      fats_per_100g: n(nf.f),
    });
    setNf({ name: "", kcal: "", p: "", c: "", f: "" });
    refresh();
  };

  const removeFood = async (id: number) => {
    await deleteFood(id);
    setEntries(entries.filter((e) => e.foodId !== id));
    refresh();
  };

  return (
    <>
      <Card title="Macros today" icon={<Utensils size={18} style={{ color: accent.violet }} />}>
        <Bar label="Calories" value={total.kcal} min={TARGETS.kcal[0]} max={TARGETS.kcal[1]} unit=" kcal" />
        <Bar label="Protein" value={total.p} min={TARGETS.protein[0]} max={TARGETS.protein[1]} unit="g" />
        <Bar label="Carbs" value={total.c} min={TARGETS.carbs[0]} max={TARGETS.carbs[1]} unit="g" />
        <Bar label="Fats" value={total.f} min={TARGETS.fats[0]} max={TARGETS.fats[1]} unit="g" />
      </Card>

      {MEALS.map((meal) => {
        const list = entries.filter((e) => e.meal === meal);
        const mealKcal = list.reduce((s, e) => s + calc(e).kcal, 0);
        return (
          <Card key={meal}>
            <div className="mb-2 flex justify-between">
              <h3 className="text-[17px] font-semibold">{meal}</h3>
              <span className="text-[13px] text-white/40">{Math.round(mealKcal)} kcal</span>
            </div>
            {list.map((e) => {
              const m = calc(e);
              return (
                <div key={e.id} className="flex items-center justify-between border-b border-white/[0.06] py-2 text-[14px]">
                  <div>
                    <div>{byId.get(e.foodId)?.name ?? "Deleted food"} · {e.grams}g</div>
                    <div className="text-[12px] text-white/35">
                      {Math.round(m.kcal)} kcal · P {m.p.toFixed(1)} · C {m.c.toFixed(1)} · F {m.f.toFixed(1)}
                    </div>
                  </div>
                  <button onClick={() => setEntries(entries.filter((x) => x.id !== e.id))} className="p-2 text-white/30 active:text-[#E08585]">
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
            <div className="mt-3 flex gap-2">
              <select className={`${inputCls} min-w-0 flex-1`} value={draft[meal]?.foodId ?? ""}
                onChange={(e) => setDraft({ ...draft, [meal]: { foodId: e.target.value, grams: draft[meal]?.grams ?? "" } })}>
                <option value="">Food…</option>
                {foods.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <input className={`${inputCls} w-20`} inputMode="decimal" placeholder="g" value={draft[meal]?.grams ?? ""}
                onChange={(e) => setDraft({ ...draft, [meal]: { foodId: draft[meal]?.foodId ?? "", grams: e.target.value } })} />
              <button className={btnCls} onClick={() => add(meal)}><Plus size={18} /></button>
            </div>
          </Card>
        );
      })}

      <Card>
        <button onClick={() => setShowFoods(!showFoods)} className="flex w-full items-center justify-between text-[17px] font-semibold">
          My foods
          <ChevronDown size={20} className={`text-white/35 transition-transform ${showFoods ? "rotate-180" : ""}`} />
        </button>
        {showFoods && (
          <div className="mt-3">
            {foods.map((f) => (
              <div key={f.id} className="flex items-center justify-between border-b border-white/[0.06] py-2 text-[14px]">
                <div>
                  <div>{f.name}</div>
                  <div className="text-[12px] text-white/35">
                    {f.calories_per_100g} kcal · P {f.protein_per_100g} · C {f.carbs_per_100g} · F {f.fats_per_100g} (per 100g)
                  </div>
                </div>
                <button onClick={() => removeFood(f.id)} className="p-2 text-white/30 active:text-[#E08585]"><Trash2 size={18} /></button>
              </div>
            ))}
            <p className="mb-2 mt-4 text-[13px] text-white/40">Add a food (values per 100g)</p>
            <input className={`${inputCls} mb-2`} placeholder="Name" value={nf.name} onChange={(e) => setNf({ ...nf, name: e.target.value })} />
            <div className="grid grid-cols-4 gap-2">
              {(["kcal", "p", "c", "f"] as const).map((k) => (
                <input key={k} className={inputCls} inputMode="decimal"
                  placeholder={{ kcal: "kcal", p: "Pro", c: "Carb", f: "Fat" }[k]}
                  value={nf[k]} onChange={(e) => setNf({ ...nf, [k]: e.target.value })} />
              ))}
            </div>
            <button className={`${btnCls} mt-3 w-full`} onClick={createFood}><Plus size={18} /> Add food</button>
          </div>
        )}
      </Card>
    </>
  );
}
