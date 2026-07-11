/**
 * Shared database helper for Vercel API routes.
 * Uses Neon serverless Postgres via process.env.DATABASE_URL.
 */
import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL environment variable is not set");
    sql = neon(url);
  }
  return sql;
}

export type Row = Record<string, unknown>;

export async function query(sqlText: string, params?: unknown[]): Promise<Row[]> {
  const db = getSql();
  const result = params ? await db.unsafe(sqlText, params) : await db.unsafe(sqlText);
  return result as Row[];
}

export async function queryOne(sqlText: string, params?: unknown[]): Promise<Row | null> {
  const rows = await query(sqlText, params);
  return rows[0] ?? null;
}