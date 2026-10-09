import pg from 'pg';
import { getDatabaseConfigured } from './security.js';

const { Pool } = pg;
let pool;

export function getDatabasePool() {
  if (!getDatabaseConfigured()) return null;

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 2,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    });
  }

  return pool;
}

export async function queryDatabase(text, values = []) {
  const database = getDatabasePool();
  if (!database) throw new Error('Database is not configured.');
  return database.query(text, values);
}