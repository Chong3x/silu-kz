const express = require("express");
const router = express.Router();
const db = require("../db");
const { authRequired } = require("../middleware/auth");

router.get("/", authRequired, (req, res)=>{
  const rows = db.prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50").all(req.userId);
  const unreadCount = db.prepare("SELECT COUNT(*) AS c FROM notifications WHERE user_id = ? AND is_read = 0").get(req.userId).c;
  res.json({ notifications: rows, unreadCount });
});

router.post("/:id/read", authRequired, (req, res)=>{
  db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?").run(req.params.id, req.userId);
  res.json({ ok: true });
});

router.post("/read-all", authRequired, (req, res)=>{
  db.prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?").run(req.userId);
  res.json({ ok: true });
});

module.exports = router;
