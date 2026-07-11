/**
 * Database schema for Histalytics.
 * Supports both SQLite (local dev) and Postgres/Neon (production).
 * The SCHEMA_SQL constant is auto-detected based on whether DATABASE_URL is set.
 */

export function getSchemaSQL(isPostgres: boolean): string {
  if (isPostgres) {
    return POSTGRES_SCHEMA;
  }
  return SQLITE_SCHEMA;
}

const SQLITE_SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  clerk_id TEXT UNIQUE,
  display_name TEXT NOT NULL DEFAULT 'User',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Symptom logs
CREATE TABLE IF NOT EXISTS symptom_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  symptom_id TEXT NOT NULL,
  symptom_name TEXT NOT NULL,
  body_system TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK(severity >= 0 AND severity <= 10),
  duration_minutes INTEGER,
  notes TEXT,
  logged_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Meal / food logs
CREATE TABLE IF NOT EXISTS meal_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  food_name TEXT NOT NULL,
  meal_type TEXT,
  portion_size TEXT,
  notes TEXT,
  logged_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Link symptoms to potential trigger meals
CREATE TABLE IF NOT EXISTS symptom_meal_links (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  symptom_log_id TEXT NOT NULL REFERENCES symptom_logs(id),
  meal_log_id TEXT NOT NULL REFERENCES meal_logs(id),
  time_delta_minutes INTEGER,
  confidence REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- User-identified triggers
CREATE TABLE IF NOT EXISTS trigger_tags (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  category TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Link symptoms to trigger tags
CREATE TABLE IF NOT EXISTS symptom_triggers (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  symptom_log_id TEXT NOT NULL REFERENCES symptom_logs(id),
  trigger_tag_id TEXT NOT NULL REFERENCES trigger_tags(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Products (from knowledge base)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  usage_notes TEXT,
  price_range TEXT,
  affiliate_url TEXT,
  applicable_symptoms TEXT,
  evidence_level TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Ingredient logs
CREATE TABLE IF NOT EXISTS ingredient_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  category TEXT,
  source_type TEXT,
  source_id TEXT,
  histamine_level TEXT,
  notes TEXT,
  logged_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Personal care product logs
CREATE TABLE IF NOT EXISTS personal_care_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  product_name TEXT NOT NULL,
  brand TEXT,
  product_type TEXT,
  ingredients TEXT,
  notes TEXT,
  logged_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Link ingredients to symptom flares
CREATE TABLE IF NOT EXISTS ingredient_flare_links (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  ingredient_log_id TEXT REFERENCES ingredient_logs(id),
  symptom_log_id TEXT REFERENCES symptom_logs(id),
  personal_care_log_id TEXT REFERENCES personal_care_logs(id),
  time_delta_minutes INTEGER,
  confidence REAL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Known trigger ingredients
CREATE TABLE IF NOT EXISTS known_ingredients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  histamine_level TEXT,
  common_in TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Early access signups
CREATE TABLE IF NOT EXISTS early_access (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'landing-page',
  notified INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_symptom_logs_user ON symptom_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_symptom ON symptom_logs(symptom_id);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user ON meal_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_symptom_meal_links_symptom ON symptom_meal_links(symptom_log_id);
CREATE INDEX IF NOT EXISTS idx_symptom_meal_links_meal ON symptom_meal_links(meal_log_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_ingredient_logs_user ON ingredient_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_ingredient_logs_name ON ingredient_logs(name);
CREATE INDEX IF NOT EXISTS idx_personal_care_logs_user ON personal_care_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_ingredient_flare_links_ingredient ON ingredient_flare_links(ingredient_log_id);
CREATE INDEX IF NOT EXISTS idx_ingredient_flare_links_symptom ON ingredient_flare_links(symptom_log_id);
CREATE INDEX IF NOT EXISTS idx_known_ingredients_name ON known_ingredients(name);
`;

const POSTGRES_SCHEMA = `
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE,
  display_name TEXT NOT NULL DEFAULT 'User',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Symptom logs
CREATE TABLE IF NOT EXISTS symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  symptom_id TEXT NOT NULL,
  symptom_name TEXT NOT NULL,
  body_system TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK(severity >= 0 AND severity <= 10),
  duration_minutes INTEGER,
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Meal / food logs
CREATE TABLE IF NOT EXISTS meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  food_name TEXT NOT NULL,
  meal_type TEXT,
  portion_size TEXT,
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Link symptoms to potential trigger meals
CREATE TABLE IF NOT EXISTS symptom_meal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symptom_log_id UUID NOT NULL REFERENCES symptom_logs(id),
  meal_log_id UUID NOT NULL REFERENCES meal_logs(id),
  time_delta_minutes INTEGER,
  confidence REAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User-identified triggers
CREATE TABLE IF NOT EXISTS trigger_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Link symptoms to trigger tags
CREATE TABLE IF NOT EXISTS symptom_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symptom_log_id UUID NOT NULL REFERENCES symptom_logs(id),
  trigger_tag_id UUID NOT NULL REFERENCES trigger_tags(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products (from knowledge base)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  usage_notes TEXT,
  price_range TEXT,
  affiliate_url TEXT,
  applicable_symptoms TEXT,
  evidence_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ingredient logs
CREATE TABLE IF NOT EXISTS ingredient_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  category TEXT,
  source_type TEXT,
  source_id TEXT,
  histamine_level TEXT,
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Personal care product logs
CREATE TABLE IF NOT EXISTS personal_care_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  product_name TEXT NOT NULL,
  brand TEXT,
  product_type TEXT,
  ingredients TEXT,
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Link ingredients to symptom flares
CREATE TABLE IF NOT EXISTS ingredient_flare_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  ingredient_log_id UUID REFERENCES ingredient_logs(id),
  symptom_log_id UUID REFERENCES symptom_logs(id),
  personal_care_log_id UUID REFERENCES personal_care_logs(id),
  time_delta_minutes INTEGER,
  confidence REAL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Known trigger ingredients
CREATE TABLE IF NOT EXISTS known_ingredients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  histamine_level TEXT,
  common_in TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Early access signups
CREATE TABLE IF NOT EXISTS early_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'landing-page',
  notified INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_symptom_logs_user ON symptom_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_symptom ON symptom_logs(symptom_id);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user ON meal_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_symptom_meal_links_symptom ON symptom_meal_links(symptom_log_id);
CREATE INDEX IF NOT EXISTS idx_symptom_meal_links_meal ON symptom_meal_links(meal_log_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_ingredient_logs_user ON ingredient_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_ingredient_logs_name ON ingredient_logs(name);
CREATE INDEX IF NOT EXISTS idx_personal_care_logs_user ON personal_care_logs(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_ingredient_flare_links_ingredient ON ingredient_flare_links(ingredient_log_id);
CREATE INDEX IF NOT EXISTS idx_ingredient_flare_links_symptom ON ingredient_flare_links(symptom_log_id);
CREATE INDEX IF NOT EXISTS idx_known_ingredients_name ON known_ingredients(name);
`;

export const SCHEMA_SQL = SQLITE_SCHEMA;
export const POSTGRES_SCHEMA_SQL = POSTGRES_SCHEMA;