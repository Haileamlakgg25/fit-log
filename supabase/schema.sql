-- DAILY_LOG(LogID(id), Date, Weight, Steps, AteLateSugar, SoreLegs, NoBathroom)
create table if not exists daily_log (
  id             bigint generated always as identity primary key,  -- LogID
  log_date       date not null unique default current_date,        -- Date (one row per day)
  weight         numeric(5,2),                                     -- Weight (kg)
  steps          integer not null default 0,                       -- Steps
  ate_late_sugar boolean not null default false,                   -- AteLateSugar
  sore_legs      boolean not null default false,                   -- SoreLegs
  no_bathroom    boolean not null default false                    -- NoBathroom
);

-- CUSTOM_FOOD(FoodID(id), Name, CaloriesPer100g, ProteinPer100g, CarbsPer100g, FatsPer100g)
create table if not exists custom_food (
  id                bigint generated always as identity primary key, -- FoodID
  name              text not null,                                   -- Name
  calories_per_100g numeric(6,1) not null,                           -- CaloriesPer100g
  protein_per_100g  numeric(5,1) not null default 0,                 -- ProteinPer100g
  carbs_per_100g    numeric(5,1) not null default 0,                 -- CarbsPer100g
  fats_per_100g     numeric(5,1) not null default 0                  -- FatsPer100g
);

-- Row Level Security. These open policies suit a private 2-person app; add Supabase Auth before sharing the URL.
alter table daily_log  enable row level security;
alter table custom_food enable row level security;
create policy "open daily_log"   on daily_log   for all using (true) with check (true);
create policy "open custom_food" on custom_food for all using (true) with check (true);

-- Starter foods: validated macros per 100g, weighed raw / frozen straight from the package
insert into custom_food (name, calories_per_100g, protein_per_100g, carbs_per_100g, fats_per_100g) values
 ('Petto di Pollo (Raw)',                    110,  23.0,  0.0,   1.0),
 ('Manzo Magro (Raw)',                       115,  22.0,  0.0,   3.0),
 ('Lonza di Maiale (Raw)',                   130,  21.0,  0.0,   5.0),
 ('Conad Riso Basmati (Raw)',                358,   8.6, 78.0,   1.1),
 ('Conad Cous Cous (Raw)',                   349,  12.0, 69.0,   1.8),
 ('Conad Fusilli Pasta (Raw)',               352,  13.0, 71.0,   1.5),
 ('Conad Patatine da Forno (Surgelate)',     135,   2.2, 21.0,   4.0),
 ('Piacersi Fiocchi di Latte 3%',             83,  13.0,  1.0,   3.0),
 ('Pane Integrale (Fresh Bakery)',           245,  10.0, 45.0,   2.0),
 ('Uova (Raw, Whole)',                       143,  13.0,  1.0,   9.5),
 ('Olio Extravergine d''Oliva',              899,   0.0,  0.0,  99.9),
 ('Mato Mato Ketchup',                        63,   1.4, 12.0,   0.3),
 ('Insalata Mista',                           20,   1.0,  3.0,   0.2),
 ('Insalata Lattuga Verde',                   15,   1.2,  2.2,   0.2),
 ('Fesa di Tacchino (Deli slices)',          105,  24.0,  0.0,   1.0),
 ('Bresaola',                                150,  32.0,  0.0,   2.0);
