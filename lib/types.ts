export type DailyLog = {
  id: number;
  log_date: string; // YYYY-MM-DD
  weight: number | null;
  steps: number;
  ate_late_sugar: boolean;
  sore_legs: boolean;
  no_bathroom: boolean;
};

export type Food = {
  id: number;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fats_per_100g: number;
};

export type MealName = "Breakfast" | "Lunch" | "Dinner" | "Snack";
export type MealEntry = { id: string; meal: MealName; foodId: number; grams: number };
export type Profile = { height: number; startWeight: number; goalWeight: number };
