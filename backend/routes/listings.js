const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const { authRequired, authOptional, adminRequired } = require("../middleware/auth");
const { notifyUser, notifyAllAdmins } = require("../lib/notify");

const uploadDir = process.env.UPLOADS_DIR || path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED_CATEGORIES = ["secondhand", "rental", "jobs", "services", "treasure", "shopads", "partner", "other"];
const PLAN_PRICING = { "10": 500, "30": 1000 };

/* 兼容处理：老数据库(比如线上已经在跑的那份)里，title_json/desc_json 这两个旧字段
   被设置成"不能为空"，新代码已经不再往这两个字段写值了，如果这两个字段还在、
   还带着 NOT NULL 的约束，插入新广告的时候会被数据库拒绝。
   这里在启动时检测一次这两个字段还在不在，写入的时候按需兼容，不用去改数据库结构本身，风险更低。 */
const listingColumns = db.prepare("PRAGMA table_info(listings)").all().map(c => c.name);
const HAS_LEGACY_JSON_COLUMNS = listingColumns.includes("title_json") && listingColumns.includes("desc_json");
if (HAS_LEGACY_JSON_COLUMNS){
  console.log("ℹ️  检测到数据库里还留着旧的 title_json/desc_json 字段，新建广告时会自动兼容写入占位值");
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb)=>{
    if (!file.mimetype.startsWith("image/")) return cb(new Error("只能上传图片文件"));
    cb(null, true);
  }
});
const uploadFields = upload.fields([
  { name: "photos", maxCount: 4 },
  { name: "paymentScreenshot", maxCount: 1 }
]);

function attachDetails(row, opts){
  opts = opts || {};
  const photos = db.prepare(
    "SELECT url FROM listing_photos WHERE listing_id = ? ORDER BY position"
  ).all(row.id).map(r=>r.url);

  let daysLeft = null;
  if (row.expires_at){
    daysLeft = Math.ceil((new Date(row.expires_at).getTime() - Date.now()) / 86400000);
  }

  const result = {
    id: row.id,
    userId: row.user_id,
    category: row.category,
    city: row.city,
    contact: row.contact,
    title: row.title,
    desc: row.description,
    status: row.status,
    planDays: row.plan_days,
    paymentAmount: row.payment_amount,
    paymentScreenshotUrl: row.payment_screenshot_url,
    rejectReason: row.reject_reason,
    createdAt: row.created_at,
    approvedAt: row.approved_at,
    expiresAt: row.expires_at,
    daysLeft,
    photos
  };
  if (opts.includeIp) result.ipAddress = row.ip_address || null;

  /* 只有"私藏推荐"分类才需要查推荐数，别的分类不用多这一次数据库查询 */
  if (row.category === "treasure"){
    result.recommendCount = db.prepare("SELECT COUNT(*) AS c FROM treasure_recommends WHERE listing_id = ?").get(row.id).c;
    result.hasRecommended = opts.currentUserId ?
      !!db.prepare("SELECT 1 FROM treasure_recommends WHERE user_id = ? AND listing_id = ?").get(opts.currentUserId, row.id) :
      false;
  }
  return result;
}

async function saveImageFile(buffer, quality){
  const filename = `${uuidv4()}.jpg`;
  const filepath = path.join(uploadDir, filename);
  await sharp(buffer).rotate().resize({ width: 1000, withoutEnlargement: true }).jpeg({ quality: quality || 78 }).toFile(filepath);
  return `/uploads/${filename}`;
}

async function savePhotos(files, listingId, startPosition){
  const saved = [];
  let position = startPosition;
  for (const file of files){
    const url = await saveImageFile(file.buffer);
    db.prepare("INSERT INTO listing_photos (listing_id, url, position) VALUES (?,?,?)").run(listingId, url, position);
    saved.push(url);
    position++;
  }
  return saved;
}

/* 获取信息列表：普通查询只返回 status='active'；?mine=true 返回当前用户自己的全部状态 */
router.get("/", authOptional, (req, res)=>{
  const { category, mine, q } = req.query;
  let rows;
  if (mine === "true"){
    if (!req.userId) return res.status(401).json({ error: "未登录" });
    rows = db.prepare("SELECT * FROM listings WHERE user_id = ? ORDER BY created_at DESC").all(req.userId);
  } else if (category){
    rows = db.prepare("SELECT * FROM listings WHERE category = ? AND status = 'active' ORDER BY created_at DESC").all(category);
  } else {
    rows = db.prepare("SELECT * FROM listings WHERE status = 'active' ORDER BY created_at DESC").all();
  }

  let listings = rows.map(row => attachDetails(row, { currentUserId: req.userId }));
  if (q){
    const needle = String(q).toLowerCase();
    listings = listings.filter(l=>
      l.title.toLowerCase().includes(needle) ||
      l.desc.toLowerCase().includes(needle) ||
      l.city.toLowerCase().includes(needle)
    );
  }
  res.json({ listings });
});

router.get("/:id", authOptional, (req, res)=>{
  const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "信息不存在" });
  res.json({ listing: attachDetails(row, { currentUserId: req.userId }) });
});

/* 发布新信息：plan = 'free' | '10' | '30'
   title/desc 现在就是普通的一份文字，不再分四种语言分别存储——
   界面语言(中/俄/哈/英)只影响网站菜单、按钮这些界面文字，不影响用户自己写的广告内容 */
router.post("/", authRequired, uploadFields, async (req, res)=>{
  try{
    const { category, city, title, desc, plan } = req.body;
    let { contact } = req.body;
    if (!ALLOWED_CATEGORIES.includes(category)){
      return res.status(400).json({ error: "分类不正确" });
    }
    /* "私藏推荐"分类不需要联系方式：读者是自己去店里，不是联系发布人 */
    const isTreasureCategory = category === "treasure";
    if (isTreasureCategory) contact = "";
    if (!category || !city || (!isTreasureCategory && !contact) || !title || !desc || !plan){
      return res.status(400).json({ error: "请填写完整信息" });
    }

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
    const id = "l_" + uuidv4();
    const now = new Date().toISOString();
    const photoFiles = (req.files && req.files.photos) || [];
    const clientIp = (req.ip || "").replace("::ffff:", ""); // 去掉IPv4映射前缀，好看一点

    /* "私藏推荐"分类完全免费：不管前端传的plan是什么，都强制走免费流程，
       而且不占用用户那有限的免费发布次数(不用user.free_posts_remaining这个池子)。
       不用担心被刷屏——这个分类依然要走正常的人工审核，审核这道门槛把关。 */
    const effectivePlan = isTreasureCategory ? "free" : plan;

    /* 老数据库里 title_json/desc_json 还在、还不能为空的话，塞一份占位值进去，
       纯粹是为了满足旧约束，新代码不会再读这两个字段 */
    const legacyTitleJson = HAS_LEGACY_JSON_COLUMNS ? JSON.stringify({ zh:title, ru:title, kk:title, en:title }) : null;
    const legacyDescJson = HAS_LEGACY_JSON_COLUMNS ? JSON.stringify({ zh:desc, ru:desc, kk:desc, en:desc }) : null;

    if (effectivePlan === "free"){
      if (!isTreasureCategory && user.free_posts_remaining <= 0){
        return res.status(400).json({ error: "你的免费发布次数已用完，请选择付费方案" });
      }
      if (HAS_LEGACY_JSON_COLUMNS){
        db.prepare(`
          INSERT INTO listings (id,user_id,category,city,contact,title,description,title_json,desc_json,status,plan_days,payment_amount,ip_address,created_at)
          VALUES (?,?,?,?,?,?,?,?,?,'pending',NULL,NULL,?,?)
        `).run(id, req.userId, category, city, contact, title, desc, legacyTitleJson, legacyDescJson, clientIp, now);
      } else {
        db.prepare(`
          INSERT INTO listings (id,user_id,category,city,contact,title,description,status,plan_days,payment_amount,ip_address,created_at)
          VALUES (?,?,?,?,?,?,?,'pending',NULL,NULL,?,?)
        `).run(id, req.userId, category, city, contact, title, desc, clientIp, now);
      }
      if (!isTreasureCategory){
        db.prepare("UPDATE users SET free_posts_remaining = free_posts_remaining - 1 WHERE id = ?").run(req.userId);
      }
    } else if (PLAN_PRICING[effectivePlan]){
      const screenshotFile = req.files && req.files.paymentScreenshot && req.files.paymentScreenshot[0];
      if (!screenshotFile){
        return res.status(400).json({ error: "请上传付款截图" });
      }
      const screenshotUrl = await saveImageFile(screenshotFile.buffer, 82);
      if (HAS_LEGACY_JSON_COLUMNS){
        db.prepare(`
          INSERT INTO listings (id,user_id,category,city,contact,title,description,title_json,desc_json,status,plan_days,payment_amount,payment_screenshot_url,ip_address,created_at)
          VALUES (?,?,?,?,?,?,?,?,?,'pending_payment',?,?,?,?,?)
        `).run(id, req.userId, category, city, contact, title, desc, legacyTitleJson, legacyDescJson, Number(plan), PLAN_PRICING[plan], screenshotUrl, clientIp, now);
      } else {
        db.prepare(`
          INSERT INTO listings (id,user_id,category,city,contact,title,description,status,plan_days,payment_amount,payment_screenshot_url,ip_address,created_at)
          VALUES (?,?,?,?,?,?,?,'pending_payment',?,?,?,?,?)
        `).run(id, req.userId, category, city, contact, title, desc, Number(plan), PLAN_PRICING[plan], screenshotUrl, clientIp, now);
      }
    } else {
      return res.status(400).json({ error: "发布方案不正确" });
    }

    if (photoFiles.length) await savePhotos(photoFiles, id, 0);

    notifyAllAdmins(
      "admin_new_listing",
      plan === "free" ? `有一条新广告《${title}》提交，等待审核` : `有一条新广告《${title}》已上传付款截图，等待确认收款`
    );

    const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(id);
    res.json({ listing: attachDetails(row, { currentUserId: req.userId }) });
  }catch(e){
    console.error(e);
    res.status(500).json({ error: "发布失败，请重试" });
  }
});

/* 编辑：仅限本人，且仅当广告还没有过期时可编辑；编辑不会重新触发付费流程，只改内容和图片 */
router.put("/:id", authRequired, uploadFields, async (req, res)=>{
  try{
    const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
    if (!row) return res.status(404).json({ error: "信息不存在" });
    if (row.user_id !== req.userId) return res.status(403).json({ error: "无权修改这条信息" });

    const { category, city, title, desc, keepPhotos } = req.body;
    let { contact } = req.body;
    if (!ALLOWED_CATEGORIES.includes(category)){
      return res.status(400).json({ error: "分类不正确" });
    }
    const isTreasureCategory = category === "treasure";
    if (isTreasureCategory) contact = "";
    if (!category || !city || (!isTreasureCategory && !contact) || !title || !desc){
      return res.status(400).json({ error: "请填写完整信息" });
    }

    /* 已上线/被拒绝/已过期/已下架 的广告，编辑后需要重新走一遍审核才能再次上线；
       还在"待审核"或"待确认付款"状态的，编辑不改变它原本的状态 */
    const needsReReview = ["active", "rejected", "expired", "hidden"].includes(row.status);
    const newStatus = needsReReview ? "pending" : row.status;

    /* 方案B：如果编辑前广告是"上线中"或"被下架"，说明它本来还有剩余天数没用完，
       审核期间不能让用户平白损失这段时间——把剩余天数记下来，等审核通过后原样接续。
       如果编辑前是"被拒绝"或"已过期"，本来就没有剩余天数可言，按全新一轮处理，不用记。 */
    let carryoverDays = null;
    if (needsReReview && ["active", "hidden"].includes(row.status) && row.expires_at){
      const remaining = Math.ceil((new Date(row.expires_at).getTime() - Date.now()) / 86400000);
      if (remaining > 0) carryoverDays = remaining;
    }

    db.prepare(`
      UPDATE listings SET category=?, city=?, contact=?, title=?, description=?, status=?, reject_reason=NULL, carryover_days=? WHERE id=?
    `).run(category, city, contact, title, desc, newStatus, carryoverDays, req.params.id);

    if (needsReReview && newStatus === "pending"){
      notifyAllAdmins("admin_edited_listing", `广告《${title}》被用户编辑后重新提交，等待复审`);
    }

    const keepList = keepPhotos ? JSON.parse(keepPhotos) : [];
    const oldPhotos = db.prepare("SELECT * FROM listing_photos WHERE listing_id = ?").all(req.params.id);
    for (const p of oldPhotos){
      if (!keepList.includes(p.url)){
        db.prepare("DELETE FROM listing_photos WHERE id = ?").run(p.id);
        fs.unlink(path.join(uploadDir, path.basename(p.url)), ()=>{});
      }
    }
    const photoFiles = (req.files && req.files.photos) || [];
    if (photoFiles.length){
      const remainingSlots = Math.max(4 - keepList.length, 0);
      await savePhotos(photoFiles.slice(0, remainingSlots), req.params.id, keepList.length);
    }
    const updated = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
    res.json({ listing: attachDetails(updated, { currentUserId: req.userId }) });
  }catch(e){
    console.error(e);
    res.status(500).json({ error: "更新失败，请重试" });
  }
});

router.delete("/:id", authRequired, (req, res)=>{
  const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "信息不存在" });

  const isOwner = row.user_id === req.userId;
  let isAdmin = false;
  if (!isOwner){
    const requester = db.prepare("SELECT role FROM users WHERE id = ?").get(req.userId);
    isAdmin = !!(requester && requester.role === "admin");
  }
  if (!isOwner && !isAdmin) return res.status(403).json({ error: "无权删除这条信息" });

  const photos = db.prepare("SELECT * FROM listing_photos WHERE listing_id = ?").all(req.params.id);
  photos.forEach(p=> fs.unlink(path.join(uploadDir, path.basename(p.url)), ()=>{}));
  if (row.payment_screenshot_url){
    fs.unlink(path.join(uploadDir, path.basename(row.payment_screenshot_url)), ()=>{});
  }
  db.prepare("DELETE FROM listing_photos WHERE listing_id = ?").run(req.params.id);
  db.prepare("DELETE FROM favorites WHERE listing_id = ?").run(req.params.id);
  db.prepare("DELETE FROM listings WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

/* ================= 管理员：审核相关 ================= */

/* 待处理队列：status=pending_payment / pending / active / rejected / expired / hidden
   status=pending 时可以加 reviewType=new(全新提交，approved_at为空) 或 edited(编辑后复审，approved_at不为空) 进一步筛选 */
router.get("/admin/queue", authRequired, adminRequired, (req, res)=>{
  const status = req.query.status;
  const reviewType = req.query.reviewType;
  const allowed = ["pending_payment", "pending", "active", "rejected", "expired", "hidden"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "status 参数不正确" });

  let rows;
  if (status === "pending" && reviewType === "new"){
    rows = db.prepare("SELECT * FROM listings WHERE status = 'pending' AND approved_at IS NULL ORDER BY created_at DESC").all();
  } else if (status === "pending" && reviewType === "edited"){
    rows = db.prepare("SELECT * FROM listings WHERE status = 'pending' AND approved_at IS NOT NULL ORDER BY created_at DESC").all();
  } else {
    rows = db.prepare("SELECT * FROM listings WHERE status = ? ORDER BY created_at DESC").all(status);
  }

  const withUser = rows.map(row=>{
    const user = db.prepare("SELECT id,name,phone,email FROM users WHERE id = ?").get(row.user_id);
    return Object.assign(attachDetails(row, { includeIp:true }), { user, isReReview: !!row.approved_at });
  });
  res.json({ listings: withUser });
});

/* 确认收款：pending_payment -> pending(进入内容审核) */
router.post("/:id/confirm-payment", authRequired, adminRequired, (req, res)=>{
  const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "信息不存在" });
  if (row.status !== "pending_payment") return res.status(400).json({ error: "该信息不在待确认付款状态" });
  db.prepare("UPDATE listings SET status = 'pending' WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

/* 通过审核：pending -> active，设置过期时间
   若 carryover_days 有值(编辑前是上线中/被下架，还有剩余天数没用完)，优先用它续接，
   保证审核这段时间不会白白吃掉用户的展示时长；否则按套餐给一个全新周期。
   "私藏推荐"分类永久有效，不设过期时间，只有管理员下架/用户自己删除才会消失。 */
router.post("/:id/approve", authRequired, adminRequired, (req, res)=>{
  const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "信息不存在" });
  if (row.status !== "pending") return res.status(400).json({ error: "该信息不在待审核状态" });
  const now = new Date();

  if (row.category === "treasure"){
    db.prepare("UPDATE listings SET status='active', approved_at=?, expires_at=NULL, reminded_expiry=0, carryover_days=NULL WHERE id=?")
      .run(now.toISOString(), req.params.id);
    return res.json({ ok: true });
  }

  const days = row.carryover_days || row.plan_days || 10; // 免费广告默认10天周期
  const expiresAt = new Date(now.getTime() + days * 86400000).toISOString();
  db.prepare("UPDATE listings SET status='active', approved_at=?, expires_at=?, reminded_expiry=0, carryover_days=NULL WHERE id=?")
    .run(now.toISOString(), expiresAt, req.params.id);
  res.json({ ok: true });
});

/* 拒绝：pending_payment 或 pending -> rejected */
router.post("/:id/reject", authRequired, adminRequired, (req, res)=>{
  const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "信息不存在" });
  if (!["pending_payment","pending"].includes(row.status)) return res.status(400).json({ error: "该状态不能被拒绝" });
  const reason = (req.body && req.body.reason) || "";
  db.prepare("UPDATE listings SET status='rejected', reject_reason=? WHERE id=?").run(reason, req.params.id);

  notifyUser(
    row.user_id,
    "listing_rejected",
    reason
      ? `你发布的《${row.title}》未通过审核，原因：${reason}`
      : `你发布的《${row.title}》未通过审核，你可以编辑后重新提交`
  );

  res.json({ ok: true });
});

/* 下架：active -> hidden（广告还在，只是从首页隐藏，可以恢复） */
router.post("/:id/hide", authRequired, adminRequired, (req, res)=>{
  const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "信息不存在" });
  if (row.status !== "active") return res.status(400).json({ error: "只有已上线的广告才能下架" });
  db.prepare("UPDATE listings SET status='hidden' WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

/* 恢复上线：hidden -> active */
router.post("/:id/unhide", authRequired, adminRequired, (req, res)=>{
  const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "信息不存在" });
  if (row.status !== "hidden") return res.status(400).json({ error: "该广告不在已下架状态" });
  db.prepare("UPDATE listings SET status='active' WHERE id=?").run(req.params.id);
  res.json({ ok: true });
});

/* "私藏推荐"分类专属的"推荐+1"：每个用户对每条店铺只能推荐一次 */
router.post("/:id/recommend", authRequired, (req, res)=>{
  const row = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "信息不存在" });
  if (row.category !== "treasure") return res.status(400).json({ error: "只有私藏推荐分类可以推荐" });

  const existing = db.prepare("SELECT 1 FROM treasure_recommends WHERE user_id = ? AND listing_id = ?").get(req.userId, req.params.id);
  if (existing) return res.status(400).json({ error: "你已经推荐过这条了" });

  db.prepare("INSERT INTO treasure_recommends (user_id, listing_id, created_at) VALUES (?,?,?)")
    .run(req.userId, req.params.id, new Date().toISOString());

  const count = db.prepare("SELECT COUNT(*) AS c FROM treasure_recommends WHERE listing_id = ?").get(req.params.id).c;
  res.json({ ok: true, recommendCount: count });
});

module.exports = router;
