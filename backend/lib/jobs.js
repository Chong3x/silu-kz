/* ========================================================
   jobs.js — 后台定时任务
   用 setInterval 常驻在 Node 进程里执行，不需要额外的系统级 cron。
   Railway 只要进程不退出，这些任务就会按周期持续执行。
   ======================================================== */
const fs = require("fs");
const path = require("path");
const db = require("../db");

const REMINDER_WINDOW_DAYS = 3;               // 过期前3天提醒
const REFERRAL_SCREENSHOT_RETENTION_DAYS = 120; // 审核完的分享截图保留约4个月后自动删除(3-6个月区间取中间值)

/* 广告到期检测：把已过期的 active 广告标记为 expired */
function expireOldListings(){
  const nowIso = new Date().toISOString();
  const result = db.prepare(
    "UPDATE listings SET status='expired' WHERE status='active' AND expires_at IS NOT NULL AND expires_at <= ?"
  ).run(nowIso);
  if (result.changes > 0){
    console.log(`⏰ 定时任务: ${result.changes} 条广告已过期下架`);
  }
}

/* 过期前3天生成站内提醒通知(只提醒一次，用 reminded_expiry 标记避免重复) */
function sendExpiryReminders(){
  const now = Date.now();
  const windowEnd = new Date(now + REMINDER_WINDOW_DAYS * 86400000).toISOString();
  const nowIso = new Date(now).toISOString();
  const rows = db.prepare(`
    SELECT * FROM listings
    WHERE status='active' AND reminded_expiry=0
      AND expires_at IS NOT NULL AND expires_at <= ? AND expires_at > ?
  `).all(windowEnd, nowIso);

  for (const row of rows){
    const title = row.title || row.id;
    const daysLeft = Math.ceil((new Date(row.expires_at).getTime() - now) / 86400000);
    db.prepare(`
      INSERT INTO notifications (user_id, type, message, is_read, created_at)
      VALUES (?, 'expiry_reminder', ?, 0, ?)
    `).run(row.user_id, `你发布的《${title}》还有 ${daysLeft} 天就要过期了，记得及时续费哦~`, new Date().toISOString());
    db.prepare("UPDATE listings SET reminded_expiry = 1 WHERE id = ?").run(row.id);
  }
  if (rows.length > 0){
    console.log(`🔔 定时任务: 发送了 ${rows.length} 条即将过期提醒`);
  }
  /* 预留：这里以后可以接入短信/邮件接口，对 rows 里的用户额外发送短信或邮件提醒 */
}

/* 定期清理已审核完的分享截图文件，释放磁盘空间 */
function cleanupReferralScreenshots(){
  const uploadDir = process.env.UPLOADS_DIR || path.join(__dirname, "..", "uploads");
  const cutoff = new Date(Date.now() - REFERRAL_SCREENSHOT_RETENTION_DAYS * 86400000).toISOString();
  const rows = db.prepare(`
    SELECT * FROM referral_submissions
    WHERE status != 'pending' AND reviewed_at IS NOT NULL AND reviewed_at <= ? AND screenshot_url IS NOT NULL
  `).all(cutoff);

  for (const row of rows){
    const filePath = path.join(uploadDir, path.basename(row.screenshot_url));
    fs.unlink(filePath, ()=>{});
    db.prepare("UPDATE referral_submissions SET screenshot_url = NULL WHERE id = ?").run(row.id);
  }
  if (rows.length > 0){
    console.log(`🧹 定时任务: 清理了 ${rows.length} 张已审核过期的分享截图`);
  }
}

function runAllJobs(){
  try{ expireOldListings(); }catch(e){ console.error("expireOldListings 出错:", e); }
  try{ sendExpiryReminders(); }catch(e){ console.error("sendExpiryReminders 出错:", e); }
  try{ cleanupReferralScreenshots(); }catch(e){ console.error("cleanupReferralScreenshots 出错:", e); }
}

function startJobs(){
  runAllJobs(); // 启动时先跑一次
  setInterval(runAllJobs, 60 * 60 * 1000); // 之后每小时跑一次
}

module.exports = { startJobs, expireOldListings, sendExpiryReminders, cleanupReferralScreenshots };
