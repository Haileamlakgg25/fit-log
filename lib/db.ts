import { supabase } from "./supabase";
import type { DailyLog, Food } from "./types";

// Local (not UTC) date as YYYY-MM-DD
export const todayISO = () => new Date().toLocaleDateString("en-CA");

/* ---------- DAILY_LOG ---------- */
export async function getLog(date = todayISO()) {
  const { data, error } = await supabase.from("daily_log").select("*").eq("log_date", date).maybeSingle();
  if (error) throw error;
  return data as DailyLog | null;
}

// Upsert only writes the columns you pass, so saving steps never overwrites weight (and vice versa).
export async function saveLog(patch: Partial<Omit<DailyLog, "id" | "log_date">>, date = todayISO()) {
  const { data, error } = await supabase
    .from("daily_log")
    .upsert({ log_date: date, ...patch }, { onConflict: "log_date" })
    .select()
    .single();
  if (error) throw error;
  return data as DailyLog;
}

export async function getLogs(limit = 120) {
  const { data, error } = await supabase
    .from("daily_log")
    .select("*")
    .order("log_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as DailyLog[]).reverse(); // oldest -> newest
}

/* ---------- CUSTOM_FOOD ---------- */
export async function getFoods() {
  const { data, error } = await supabase.from("custom_food").select("*").order("name");
  if (error) throw error;
  return data as Food[];
}

export async function addFood(food: Omit<Food, "id">) {
  const { data, error } = await supabase.from("custom_food").insert(food).select().single();
  if (error) throw error;
  return data as Food;
}

export async function deleteFood(id: number) {
  const { error } = await supabase.from("custom_food").delete().eq("id", id);
  if (error) throw error;
}
