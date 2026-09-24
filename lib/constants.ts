import type { Profile } from "./types";

export const DEFAULT_PROFILE: Profile = { height: 167, startWeight: 92.95, goalWeight: 65 };

// [min, max]
export const TARGETS = {
  kcal: [1450, 1500],
  protein: [110, 120],
  carbs: [130, 160],
  fats: [45, 50],
} as const;

export const PLANS = [
  {
    day: 1,
    meals: [
      ["Breakfast", "50g Pane integrale, 60g Bresaola"],
      ["Lunch", "180g Chicken, 200g Potatoes, Salad, 15g Olive Oil"],
      ["Dinner", "180g Chicken, 70g Rice, Salad, 15g Olive Oil"],
    ],
    total: "1420 kcal | 119g Pro | 131g Carb | 41g Fat",
  },
  {
    day: 2,
    meals: [
      ["Breakfast", "50g Pane integrale, 70g Turkey"],
      ["Lunch", "1 Piadina (100g), 200g Fiocchi di latte 3%, Salad, 15g Olive Oil"],
      ["Dinner", "200g Lean Pork, 70g Pasta, Salad, 12g Olive Oil"],
    ],
    total: "1485 kcal | 110g Pro | 143g Carb | 49g Fat",
  },
  {
    day: 3,
    meals: [
      ["Breakfast", "50g Pane integrale, 70g Turkey"],
      ["Lunch", "180g Lean Beef, 220g Potatoes, Salad, 15g Olive Oil"],
      ["Dinner", "180g Lean Beef, 70g Rice, Salad, 15g Olive Oil"],
    ],
    total: "1475 kcal | 107g Pro | 130g Carb | 50g Fat",
  },
];

export const SWAPS = [
  { label: "Ate Fruit", action: "Remove 30g rice or 100g potatoes from dinner." },
  { label: "Ate 20g Almonds", action: "Remove 1 Tbsp olive oil." },
  { label: "Ate 50g Turkey", action: "Remove 40–50g meat from your next meal." },
];

export const SOS = [
  { title: "Hot coffee", body: "Sip a hot coffee. Warmth plus caffeine gets the gut moving." },
  { title: "Warm water", body: "Drink a large glass of warm water slowly, then walk around for a few minutes." },
  { title: "Deep 2-minute floor squat", body: "Sit in a deep squat with feet flat and chest up for 2 minutes. It puts your body in the natural position for a bowel movement." },
];
