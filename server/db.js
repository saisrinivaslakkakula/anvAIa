import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "data", "db.json");  // 👈 fixed


export async function loadDB() {
  const raw = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(raw);
}

export async function saveDB(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  return db;
}

// util: next id for numeric tables
export function nextId(rows) {
  const max = rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0);
  return max + 1;
}
