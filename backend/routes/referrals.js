const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const { authRequired, adminRequired } = require("../middleware/auth");

const uploadDir = process.env.UPLOADS_DIR || path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

/* 分享截图限制 2MB，按要求单独控制 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb)=>{
    if (!file.mimetype.startsWith("image/")) return cb(new Error("只能上传图片文件"));
    cb(null, true);
  }
});

/* 用户提交分享截图（每人只能成功参与一次） */
router.post("/", authRequired, upload.single("screenshot"), async (req, res)=>{
  try{
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
    if (user.referral_reward_granted){
      return res.status(400).json({ error: "你已经领取过分享奖励啦，每人限参与一次" });
    }
    const existingActive = db.prepare(
      "SELECT id FROM referral_submissions WHERE user_id = ? AND status IN ('pending','approved')"
    ).get(req.userId);
    if (existingActive){
      return res.status(400).json({ error: "你已经提交过一次，正在等待审核" });
    }
    if (!req.file){
      return res.status(400).json({ error: "请上传分享截图" });
    }
    const filename = `${uuidv4()}.jpg`;
    await sharp(req.file.buffer).rotate().resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 82 }).toFile(path.join(uploadDir, filename));
    const url = `/uploads/${filename}`;

    const id = "r_" + uuidv4();
    db.prepare(`
      INSERT INTO referral_submissions (id, user_id, screenshot_url, status, created_at)
      VALUES (?,?,?,'pending',?)
    `).run(id, req.userId, url, new Date().toISOString());
    res.json({ ok: true });
  }catch(e){
    console.error(e);
    res.status(500).json({ error: "提交失败，请重试" });
  }
});

/* 查看自己的提交状态 */
router.get("/mine", authRequired, (req, res)=>{
  const rows = db.prepare("SELECT * FROM referral_submissions WHERE user_id = ? ORDER BY created_at DESC").all(req.userId);
  res.json({ submissions: rows });
});

/* 管理员：查看提交列表 */
router.get("/", authRequired, adminRequired, (req, res)=>{
  const { status } = req.query;
  let rows;
  if (status){
    rows = db.prepare("SELECT * FROM referral_submissions WHERE status = ? ORDER BY created_at ASC").all(status);
  } else {
    rows = db.prepare("SELECT * FROM referral_submissions ORDER BY created_at ASC").all();
  }
  const withUser = rows.map(r=>{
    const user = db.prepare("SELECT id,name,phone,email FROM users WHERE id = ?").get(r.user_id);
    return Object.assign({}, r, { user });
  });
  res.json({ submissions: withUser });
});

/* 管理员：审核通过 -> 发放1次免费发布机会(每人只发一次) */
router.post("/:id/approve", authRequired, adminRequired, (req, res)=>{
  const row = db.prepare("SELECT * FROM referral_submissions WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "记录不存在" });
  if (row.status !== "pending") return res.status(400).json({ error: "该记录已处理过" });

  db.prepare("UPDATE referral_submissions SET status='approved', reviewed_at=? WHERE id=?")
    .run(new Date().toISOString(), req.params.id);

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(row.user_id);
  if (user && !user.referral_reward_granted){
    db.prepare("UPDATE users SET free_posts_remaining = free_posts_remaining + 1, referral_reward_granted = 1 WHERE id = ?")
      .run(row.user_id);
  }
  res.json({ ok: true });
});

router.post("/:id/reject", authRequired, adminRequired, (req, res)=>{
  const row = db.prepare("SELECT * FROM referral_submissions WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "记录不存在" });
  if (row.status !== "pending") return res.status(400).json({ error: "该记录已处理过" });
  db.prepare("UPDATE referral_submissions SET status='rejected', reviewed_at=? WHERE id=?")
    .run(new Date().toISOString(), req.params.id);
  res.json({ ok: true });
});

module.exports = router;
