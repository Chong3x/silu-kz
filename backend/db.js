/* ========================================================
   db.js — 使用 better-sqlite3，首次启动自动建表
   数据文件保存在 backend/data.sqlite（部署到 Railway 时
   建议挂载一个 Volume，参考 README，否则重新部署会丢数据）
   ======================================================== */
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = process.env.DB_PATH || path.join(__dirname, "data.sqlite");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  google_id TEXT UNIQUE,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user',              -- 'user' | 'admin'
  free_posts_remaining INTEGER NOT NULL DEFAULT 1,
  referral_reward_granted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS otp_codes (
  phone TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_sent_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,       -- secondhand | rental | jobs | services | other
  city TEXT NOT NULL,
  contact TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',   -- pending_payment | pending | active | rejected | expired | hidden
  plan_days INTEGER,                        -- 10 | 30 | NULL(免费)
  payment_amount INTEGER,                   -- 坚戈
  payment_screenshot_url TEXT,
  reject_reason TEXT,
  reminded_expiry INTEGER NOT NULL DEFAULT 0,
  approved_at TEXT,
  expires_at TEXT,
  ip_address TEXT,
  carryover_days INTEGER,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS listing_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER NOT NULL,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id TEXT NOT NULL,
  listing_id TEXT NOT NULL,
  PRIMARY KEY (user_id, listing_id)
);

/* "私藏推荐"分类专属的"推荐+1"记录，每个用户对每条店铺只能推荐一次 */
CREATE TABLE IF NOT EXISTS treasure_recommends (
  user_id TEXT NOT NULL,
  listing_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  contact TEXT,
  status TEXT NOT NULL DEFAULT 'pending',   -- pending | read | resolved
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS referral_submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  screenshot_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',   -- pending | approved | rejected
  created_at TEXT NOT NULL,
  reviewed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

/* 迁移：给旧数据库（比如线上已经在跑的那份）补上新加的字段，
   已经有这个字段的话会报错，直接忽略即可，不影响已有数据 */
try{ db.exec("ALTER TABLE listings ADD COLUMN ip_address TEXT"); }catch(e){ /* 字段已存在 */ }
try{ db.exec("ALTER TABLE listings ADD COLUMN carryover_days INTEGER"); }catch(e){ /* 字段已存在 */ }
try{ db.exec("ALTER TABLE listings ADD COLUMN title TEXT"); }catch(e){ /* 字段已存在 */ }
try{ db.exec("ALTER TABLE listings ADD COLUMN description TEXT"); }catch(e){ /* 字段已存在 */ }

/* 迁移：把旧的"四语言各存一份"(title_json/desc_json)安全转换成新的单一字段。
   只处理 title 还是空的那些行，不会重复处理、也不会碰旧字段本身，
   老的 title_json/desc_json 列会原样留在数据库里，不删除，方便万一要回头核对。
   老数据库(线上那份)才有 title_json 这一列，全新安装的数据库根本没有这一列，
   所以整段包在 try/catch 里，取不到就直接跳过，不影响全新安装。 */
try{
  const legacyRows = db.prepare(
    "SELECT id, title_json, desc_json FROM listings WHERE title_json IS NOT NULL AND (title IS NULL OR title = '')"
  ).all();
  if (legacyRows.length > 0){
    const update = db.prepare("UPDATE listings SET title = ?, description = ? WHERE id = ?");
    for (const row of legacyRows){
      let titleText = "", descText = "";
      try{
        const titleObj = JSON.parse(row.title_json) || {};
        titleText = titleObj.zh || titleObj.ru || titleObj.kk || titleObj.en || "";
      }catch(e){ /* 解析失败就留空，不让迁移中断 */ }
      try{
        const descObj = JSON.parse(row.desc_json) || {};
        descText = descObj.zh || descObj.ru || descObj.kk || descObj.en || "";
      }catch(e){ /* 解析失败就留空，不让迁移中断 */ }
      update.run(titleText, descText, row.id);
    }
    console.log(`✅ 已将 ${legacyRows.length} 条旧格式的广告标题/描述迁移为新格式`);
  }
}catch(e){ /* 全新安装的数据库没有 title_json 这一列，属于正常情况，跳过即可 */ }

/* 迁移："私藏推荐"分类不再需要联系方式，把这个分类下已经存过的联系方式数据清空 */
try{
  const cleared = db.prepare(
    "UPDATE listings SET contact = '' WHERE category = 'treasure' AND contact != ''"
  ).run();
  if (cleared.changes > 0){
    console.log(`✅ 已清空 ${cleared.changes} 条"私藏推荐"广告的联系方式`);
  }
}catch(e){ /* 忽略，不影响其它启动流程 */ }

module.exports = db;
