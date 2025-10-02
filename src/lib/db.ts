import Database from "better-sqlite3";

let db: Database.Database;

if (!globalThis.sqliteDb) {
  db = new Database("database.sqlite", { verbose: console.log });
  globalThis.sqliteDb = db;

  // Khởi tạo schema ở đây
  db.exec(`
    -- Bảng người chơi
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatar TEXT -- link ảnh đại diện
    );

    -- Bảng giải đấu
    CREATE TABLE IF NOT EXISTS tournaments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('knockout', 'round')),
      status TEXT NOT NULL CHECK(status IN ('active', 'upcoming','completed')),
      rounds INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Người chơi tham gia giải đấu
    CREATE TABLE IF NOT EXISTS tournament_players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tournament_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
      FOREIGN KEY (player_id) REFERENCES players(id),
      UNIQUE (tournament_id, player_id)
    );

    -- Trận đấu
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tournament_id INTEGER NOT NULL,
      round INTEGER NOT NULL,
      player1_id INTEGER NOT NULL,
      player2_id INTEGER NOT NULL,
      team1_name TEXT NOT NULL, -- tên đội PES mà player1 chọn
      team2_name TEXT NOT NULL, -- tên đội PES mà player2 chọn
      score1 INTEGER DEFAULT 0,
      score2 INTEGER DEFAULT 0,
      winner_id INTEGER,
      played_at DATETIME,
      FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
      FOREIGN KEY (player1_id) REFERENCES players(id),
      FOREIGN KEY (player2_id) REFERENCES players(id),
      FOREIGN KEY (winner_id) REFERENCES players(id)
    );

    -- Bảng xếp hạng (áp dụng cho league)
    CREATE TABLE IF NOT EXISTS standings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tournament_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      draws INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      goals_for INTEGER DEFAULT 0,
      goals_against INTEGER DEFAULT 0,
      FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
      FOREIGN KEY (player_id) REFERENCES players(id),
      UNIQUE (tournament_id, player_id)
    );

  `);
} else {
  db = globalThis.sqliteDb;
}

export default db;

declare global {
  // để tránh lỗi TS khi dùng global
  var sqliteDb: Database.Database | undefined;
}
