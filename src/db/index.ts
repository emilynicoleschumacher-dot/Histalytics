/**
 * Unified database adapter — switches between SQLite (local dev) and
 * Neon Postgres (production / Vercel) based on DATABASE_URL env var.
 *
 * Exports a consistent API so server functions don't need to know
 * which database is running underneath.
 */

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { getSchemaSQL } from "./schema";
import { Database } from "bun:sqlite";
import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/* ── Types ── */

export interface DbRow {
  [key: string]: unknown;
}

export type DbResult = DbRow[];

export interface Db {
  /** Execute a query and return all matching rows. */
  all: (sql: string, params?: Record<string, unknown> | unknown[]) => DbRow[];
  /** Execute a query and return the first matching row (or null). */
  get: (sql: string, params?: Record<string, unknown> | unknown[]) => DbRow | null;
  /** Execute a statement (INSERT/UPDATE/DELETE) and return nothing. */
  run: (sql: string, params?: Record<string, unknown> | unknown[]) => void;
  /** Execute raw SQL (for DDL / migrations). */
  exec: (sql: string) => void;
  /**
   * Backward-compatible query builder — mirrors the old SQLite API:
   *   db.query(sql).all(params) / .get(params) / .run(params)
   */
  query: (sql: string) => {
    all: (params?: Record<string, unknown> | unknown[]) => DbRow[];
    get: (params?: Record<string, unknown> | unknown[]) => DbRow | null;
    run: (params?: Record<string, unknown> | unknown[]) => void;
  };
}

/* ── SQLite adapter ── */

function createSqliteAdapter(): Db {
  const DB_PATH = path.resolve(__dirname, "../../data/histalytics.db");
  const dir = path.dirname(DB_PATH);
  fs.mkdirSync(dir, { recursive: true });

  const db = new Database(DB_PATH);
  db.exec("PRAGMA journal_mode=WAL");
  db.exec("PRAGMA foreign_keys=ON");

  return {
    all(sql: string, params?: Record<string, unknown> | unknown[]) {
      if (Array.isArray(params)) {
        const stmt = db.query(sql);
        const rows = stmt.all(...params) as DbRow[];
        return rows;
      }
      const stmt = db.query(sql);
      const rows = stmt.all(params as Record<string, unknown>) as DbRow[];
      return rows;
    },
    get(sql: string, params?: Record<string, unknown> | unknown[]) {
      const stmt = db.query(sql);
      if (Array.isArray(params)) {
        return (stmt.get(...params) as DbRow) ?? null;
      }
      return (stmt.get(params as Record<string, unknown>) as DbRow) ?? null;
    },
    run(sql: string, params?: Record<string, unknown> | unknown[]) {
      const stmt = db.query(sql);
      if (Array.isArray(params)) {
        stmt.run(...params);
      } else {
        stmt.run(params as Record<string, unknown>);
      }
    },
    exec(sql: string) {
      db.exec(sql);
    },
    query(sql: string) {
      const stmt = db.query(sql);
      return {
        all: (params?: Record<string, unknown> | unknown[]) => {
          if (Array.isArray(params)) return stmt.all(...params) as DbRow[];
          return stmt.all(params as Record<string, unknown>) as DbRow[];
        },
        get: (params?: Record<string, unknown> | unknown[]) => {
          if (Array.isArray(params)) return (stmt.get(...params) as DbRow) ?? null;
          return (stmt.get(params as Record<string, unknown>) as DbRow) ?? null;
        },
        run: (params?: Record<string, unknown> | unknown[]) => {
          if (Array.isArray(params)) stmt.run(...params);
          else stmt.run(params as Record<string, unknown>);
        },
      };
    },
  };
}

/* ── Postgres / Neon adapter ── */

function createPostgresAdapter(connectionString: string): Db {
  const sql: NeonQueryFunction<Record<string, unknown>> = neon(connectionString);

  // Convert named params ($key, $userId) to positional ($1, $2) for neon
  function convertToPositional(sqlText: string, params: Record<string, unknown>): { sql: string; values: unknown[] } {
    const keys = Object.keys(params);
    const values = keys.map((k) => params[k]);
    // Replace $key with $N (positional). Need to sort by longest key first to avoid partial matches
    const sortedKeys = [...keys].sort((a, b) => b.length - a.length);
    let result = sqlText;
    for (let i = 0; i < sortedKeys.length; i++) {
      const key = sortedKeys[i];
      const pos = i + 1;
      result = result.replace(new RegExp(`\\${key}\\b`, "g"), `${pos}`);
    }
    return { sql: result, values };
  }

  return {
    all(sqlText: string, params?: Record<string, unknown> | unknown[]) {
      if (Array.isArray(params)) {
        const result = sql.unsafe(sqlText, params as any[]);
        return result as unknown as DbRow[];
      }
      if (params && typeof params === "object") {
        const { sql: convertedSql, values } = convertToPositional(sqlText, params as Record<string, unknown>);
        const result = sql.unsafe(convertedSql, values);
        return result as unknown as DbRow[];
      }
      const result = sql.unsafe(sqlText);
      return result as unknown as DbRow[];
    },
    get(sqlText: string, params?: Record<string, unknown> | unknown[]) {
      const rows = this.all(sqlText, params);
      return (rows[0] as DbRow) ?? null;
    },
    run(sqlText: string, params?: Record<string, unknown> | unknown[]) {
      this.all(sqlText, params);
    },
    exec(sqlText: string) {
      const statements = sqlText
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const stmt of statements) {
        sql.unsafe(stmt);
      }
    },
    query(sqlText: string) {
      const self = this;
      return {
        all: (params?: Record<string, unknown> | unknown[]) => self.all(sqlText, params),
        get: (params?: Record<string, unknown> | unknown[]) => self.get(sqlText, params),
        run: (params?: Record<string, unknown> | unknown[]) => self.run(sqlText, params),
      };
    },
  };
}

/* ── Singleton ── */

let _db: Db | null = null;

export function getDb(): Db {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (url) {
    console.log("[db] Using Neon Postgres");
    _db = createPostgresAdapter(url);
  } else {
    console.log("[db] Using SQLite (local dev)");
    _db = createSqliteAdapter();
  }

  return _db;
}

export function createTables(): void {
  const db = getDb();
  const isPostgres = !!process.env.DATABASE_URL;
  const schema = getSchemaSQL(isPostgres);
  db.exec(schema);
}

/**
 * Get or create the default demo user. In production with Clerk,
 * this will be replaced by real user IDs.
 */
export function getOrCreateDefaultUser(): string {
  const db = getDb();
  const isPostgres = !!process.env.DATABASE_URL;
  const existing = db.get("SELECT id FROM users LIMIT 1");
  if (existing) return existing.id as string;

  if (isPostgres) {
    db.run("INSERT INTO users (display_name) VALUES ('Demo User')");
    const created = db.get("SELECT id FROM users LIMIT 1");
    return created!.id as string;
  } else {
    db.run("INSERT INTO users (id, display_name) VALUES (lower(hex(randomblob(16))), 'Demo User')");
    const created = db.get("SELECT id FROM users LIMIT 1");
    return created!.id as string;
  }
}