/**
 * Database entry point — re-exports the unified adapter.
 * Switch between SQLite (local dev) and Neon Postgres (production)
 * by setting the DATABASE_URL environment variable.
 *
 * Auto-creates tables and seeds data on first initialization.
 */

import { createTables } from "./index";
import * as db from "./index";
import { seedDatabase, isSeeded } from "./seed";

// Re-export everything
export const getDb = db.getDb;
export const getOrCreateDefaultUser = db.getOrCreateDefaultUser;
export const closeDb = () => {};

// Initialize tables on first import
try {
  createTables();
  // Auto-seed if products table is empty
  if (!isSeeded()) {
    seedDatabase().catch((e) => console.warn("[db] Seed error:", e));
  }
} catch (e) {
  console.warn("[db] Init error (may already be initialized):", e);
}