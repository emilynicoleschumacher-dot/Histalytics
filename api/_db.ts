/**
 * Shared database helper for Vercel Edge API routes.
 * Creates all tables on first use and provides a `sql` tagged template.
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
let _sql: ReturnType<typeof neon> | null = null;
let _initialized = false;

function getSql() {
  if (!_sql) {
    if (!url) throw new Error("DATABASE_URL not set");
    _sql = neon(url);
  }
  return _sql;
}

export async function initDB() {
  if (_initialized) return;
  const db = getSql();

  await db`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  // Users table
  await db`CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT UNIQUE,
    display_name TEXT NOT NULL DEFAULT 'User',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  // Symptom logs
  await db`CREATE TABLE IF NOT EXISTS symptom_logs (
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
  )`;

  // Meal logs
  await db`CREATE TABLE IF NOT EXISTS meal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    food_name TEXT NOT NULL,
    meal_type TEXT,
    portion_size TEXT,
    notes TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  // Supplement logs
  await db`CREATE TABLE IF NOT EXISTS supplement_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    supplement_name TEXT NOT NULL,
    brand TEXT,
    dosage TEXT,
    frequency TEXT,
    notes TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  // Personal care product logs
  await db`CREATE TABLE IF NOT EXISTS personal_care_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    product_name TEXT NOT NULL,
    brand TEXT,
    product_type TEXT,
    ingredients TEXT,
    notes TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  // Ingredient logs
  await db`CREATE TABLE IF NOT EXISTS ingredient_logs (
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
  )`;

  // Ingredient flare links
  await db`CREATE TABLE IF NOT EXISTS ingredient_flare_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    ingredient_log_id UUID REFERENCES ingredient_logs(id),
    symptom_log_id UUID REFERENCES symptom_logs(id),
    personal_care_log_id UUID REFERENCES personal_care_logs(id),
    time_delta_minutes INTEGER,
    confidence REAL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  // Indexes
  await db`CREATE INDEX IF NOT EXISTS idx_symptom_logs_user ON symptom_logs(user_id, logged_at)`;
  await db`CREATE INDEX IF NOT EXISTS idx_meal_logs_user ON meal_logs(user_id, logged_at)`;
  await db`CREATE INDEX IF NOT EXISTS idx_supplement_logs_user ON supplement_logs(user_id, logged_at)`;

  _initialized = true;
}

export async function getOrCreateUser(clerkId: string): Promise<string> {
  const db = getSql();
  // Try to find existing user
  const [user] = await db`SELECT id FROM users WHERE clerk_id = ${clerkId}`;
  if (user) return user.id;

  // Create new user
  const [created] = await db`
    INSERT INTO users (clerk_id, display_name) VALUES (${clerkId}, 'User') RETURNING id
  `;
  return created.id;
}

export function sql() {
  return getSql();
}