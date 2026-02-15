const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "stack.db"));

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    best_score INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    total_perfects INTEGER DEFAULT 0,
    best_combo INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    achievements TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_id)
  );

  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    max_combo INTEGER DEFAULT 0,
    perfects INTEGER DEFAULT 0,
    zone TEXT,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_scores_user ON scores(user_id);
  CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
  CREATE INDEX IF NOT EXISTS idx_users_best ON users(best_score DESC);
`);

// Prepared statements
const stmts = {
  findUser: db.prepare("SELECT * FROM users WHERE provider = ? AND provider_id = ?"),
  findUserById: db.prepare("SELECT * FROM users WHERE id = ?"),
  createUser: db.prepare(`
    INSERT INTO users (provider, provider_id, display_name, email, avatar_url)
    VALUES (?, ?, ?, ?, ?)
  `),
  updateProfile: db.prepare(`
    UPDATE users SET display_name = ?, email = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  updateStats: db.prepare(`
    UPDATE users SET
      best_score = MAX(best_score, ?),
      games_played = games_played + 1,
      total_perfects = total_perfects + ?,
      best_combo = MAX(best_combo, ?),
      total_score = total_score + ?,
      xp = xp + ?,
      achievements = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  insertScore: db.prepare(`
    INSERT INTO scores (user_id, score, max_combo, perfects, zone)
    VALUES (?, ?, ?, ?, ?)
  `),
  getLeaderboard: db.prepare(`
    SELECT id, display_name, best_score, avatar_url, xp
    FROM users ORDER BY best_score DESC LIMIT 50
  `),
  getUserScores: db.prepare(`
    SELECT score, max_combo, perfects, zone, played_at
    FROM scores WHERE user_id = ? ORDER BY played_at DESC LIMIT 20
  `),
};

module.exports = { db, stmts };
