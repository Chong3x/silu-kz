const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const { authRequired, authOptional, adminRequired } = require("../middleware/auth");
const { notifyUser, notifyAllAdmins } = require("../lib/notify");

const ALLOWED_TYPES = ["bug", "suggestion", "complaint", "other"];
const ALLOWED_STATUS = ["pending", "read", "resolved"];
const STATUS_LABEL_ZH = { pending:"待处理", read:"已读", resolved:"已解决" };

/* 提交反馈：登录与否都可以提交(未登录时 user_id 为空) */
router.post("/", authOptional, (req, res)=>{
  const { type, content, contact } = req.body || {};
  if (!type || !content || !content.trim()){
    return res.status(400).json({ error: "请填写反馈类型和内容" });
  }
  const useType = ALLOWED_TYPES.includes(type) ? type : "other";
  const id = "f_" + uuidv4();
  db.prepare(`
    INSERT INTO feedback (id, user_id, type, content, contact, status, created_at)
    VALUES (?,?,?,?,?,'pending',?)
  `).run(id, req.userId || null, useType, content.trim(), contact || null, new Date().toISOString());

  const preview = content.trim().length > 30 ? content.trim().slice(0, 30) + "…" : content.trim();
  notifyAllAdmins("admin_new_feedback", `收到一条新反馈：${preview}`);

  res.json({ ok: true });
});

/* 管理员：查看反馈列表，可按状态筛选 */
router.get("/", authRequired, adminRequired, (req, res)=>{
  const { status } = req.query;
  let rows;
  if (status && ALLOWED_STATUS.includes(status)){
    rows = db.prepare("SELECT * FROM feedback WHERE status = ? ORDER BY created_at DESC").all(status);
  } else {
    rows = db.prepare("SELECT * FROM feedback ORDER BY created_at DESC").all();
  }
  res.json({ feedback: rows });
});

/* 管理员：只能标记状态，不能编辑内容 */
router.post("/:id/status", authRequired, adminRequired, (req, res)=>{
  const { status } = req.body || {};
  if (!ALLOWED_STATUS.includes(status)){
    return res.status(400).json({ error: "状态不正确" });
  }
  const row = db.prepare("SELECT * FROM feedback WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "反馈不存在" });
  db.prepare("UPDATE feedback SET status = ? WHERE id = ?").run(status, req.params.id);

  if (row.user_id){
    notifyUser(
      row.user_id,
      "feedback_status_changed",
      `你提交的反馈状态更新为：${STATUS_LABEL_ZH[status] || status}`
    );
  }

  res.json({ ok: true });
});

module.exports = router;
