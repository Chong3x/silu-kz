/* ========================================================
   notify.js — 站内通知的小工具函数，给listings/feedback等路由共用
   ======================================================== */
const db = require("../db");

/* 给单个用户发一条通知 */
function notifyUser(userId, type, message){
  if (!userId) return;
  db.prepare(`
    INSERT INTO notifications (user_id, type, message, is_read, created_at)
    VALUES (?, ?, ?, 0, ?)
  `).run(userId, type, message, new Date().toISOString());
}

/* 给所有管理员各发一条通知(管理员可能不止一个，每人都要收到) */
function notifyAllAdmins(type, message){
  const admins = db.prepare("SELECT id FROM users WHERE role = 'admin'").all();
  for (const admin of admins){
    notifyUser(admin.id, type, message);
  }
}

module.exports = { notifyUser, notifyAllAdmins };
