import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { config } from './config.mjs';

const absoluteDbPath = path.resolve(process.cwd(), config.dbPath);
fs.mkdirSync(path.dirname(absoluteDbPath), { recursive: true });

const db = new Database(absoluteDbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS poetry_generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt TEXT NOT NULL,
    interpretation TEXT NOT NULL,
    image_url TEXT NOT NULL,
    model_text TEXT NOT NULL,
    model_image TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const insertGenerationStmt = db.prepare(`
  INSERT INTO poetry_generations (
    prompt,
    interpretation,
    image_url,
    model_text,
    model_image
  ) VALUES (?, ?, ?, ?, ?)
`);

const listGenerationsStmt = db.prepare(`
  SELECT id, prompt, interpretation, image_url, model_text, model_image, created_at
  FROM poetry_generations
  ORDER BY id DESC
  LIMIT ?
`);

export function savePoetryGeneration(record) {
  const info = insertGenerationStmt.run(
    record.prompt,
    record.interpretation,
    record.imageUrl,
    record.modelText,
    record.modelImage,
  );
  return Number(info.lastInsertRowid);
}

export function listPoetryGenerations(limit = 20) {
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(Math.floor(limit), 1), 100) : 20;
  return listGenerationsStmt.all(safeLimit);
}

export function getDatabaseInfo() {
  return {
    path: absoluteDbPath,
  };
}
