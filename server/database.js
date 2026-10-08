import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: path.join(__dirname, 'civic_mana.db'),
    driver: sqlite3.Database
  });

  // Create Users table
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('citizen', 'worker', 'admin')),
      department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default demo accounts if table is empty
  const userCount = await dbInstance.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    await dbInstance.run(`
      INSERT INTO users (name, email, password, role, department) VALUES
      ('Citizen User', 'user@civic.com', 'user123', 'citizen', NULL),
      ('Field Worker', 'worker@civic.com', 'worker123', 'worker', 'Public Works'),
      ('Road Specialist', 'roadworker@civic.com', 'worker123', 'worker', 'Road Works'),
      ('Jeffery Admin', 'admin@civic.com', 'admin123', 'admin', 'Management');
    `);
    console.log('SQLite database initialized & seeded with demo user & worker credentials.');
  }

  return dbInstance;
}
