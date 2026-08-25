const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const { authRequired, SECRET } = require("../middleware/auth");
const { sendOtp } = require("../lib/otpProvider");

const OTP_TTL_MS = 5 * 60 * 1000;      // 验证码5分钟有效
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60秒内不能重复发送
const OTP_MAX_ATTEMPTS = 5;

function signToken(userId){
  return jwt.sign({ userId }, SECRET, { expiresIn: "30d" });
}
function publicUser(u){
  return {
    id: u.id,
    name: u.name,
    phone: u.phone,
    email: u.email,
    role: u.role,
    freePostsRemaining: u.free_posts_remaining,
    referralRewardGranted: !!u.referral_reward_granted
  };
}
function normalizePhone(phone){
  return String(phone || "").replace(/[^\d+]/g, "");
}

/* ---------- 手机号 + 验证码：请求验证码 ---------- */
router.post("/otp/request", async (req, res)=>{
  const phone = normalizePhone(req.body.phone);
  if (!phone || phone.length < 6){
    return res.status(400).json({ error: "请输入正确的手机号" });
  }
  const existing = db.prepare("SELECT * FROM otp_codes WHERE phone = ?").get(phone);
  if (existing){
    const sinceLastSend = Date.now() - new Date(existing.last_sent_at).getTime();
    if (sinceLastSend < OTP_RESEND_COOLDOWN_MS){
      const wait = Math.ceil((OTP_RESEND_COOLDOWN_MS - sinceLastSend) / 1000);
      return res.status(429).json({ error: `请求过于频繁，请 ${wait} 秒后再试` });
    }
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS).toISOString();
  db.prepare(`
    INSERT INTO otp_codes (phone, code, expires_at, attempts, last_sent_at)
    VALUES (?,?,?,0,?)
    ON CONFLICT(phone) DO UPDATE SET code=excluded.code, expires_at=excluded.expires_at, attempts=0, last_sent_at=excluded.last_sent_at
  `).run(phone, code, expiresAt, now.toISOString());

  try{
    const result = await sendOtp(phone, code);
    res.json({ ok: true, dev: !!result.dev, devCode: result.dev ? code : undefined });
  }catch(e){
    res.status(500).json({ error: e.message || "验证码发送失败" });
  }
});

function checkOtp(phone, code){
  const row = db.prepare("SELECT * FROM otp_codes WHERE phone = ?").get(phone);
  if (!row) return { ok:false, error:"请先获取验证码" };
  if (new Date(row.expires_at).getTime() < Date.now()){
    db.prepare("DELETE FROM otp_codes WHERE phone = ?").run(phone);
    return { ok:false, error:"验证码已过期，请重新获取" };
  }
  if (row.attempts >= OTP_MAX_ATTEMPTS){
    db.prepare("DELETE FROM otp_codes WHERE phone = ?").run(phone);
    return { ok:false, error:"尝试次数过多，请重新获取验证码" };
  }
  if (row.code !== String(code)){
    db.prepare("UPDATE otp_codes SET attempts = attempts + 1 WHERE phone = ?").run(phone);
    return { ok:false, error:"验证码不正确" };
  }
  db.prepare("DELETE FROM otp_codes WHERE phone = ?").run(phone);
  return { ok:true };
}

/* ---------- 普通用户：验证码登录/注册 ---------- */
router.post("/otp/verify", (req, res)=>{
  const phone = normalizePhone(req.body.phone);
  const { code, name } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "请填写完整信息" });

  const check = checkOtp(phone, code);
  if (!check.ok) return res.status(400).json({ error: check.error });

  let user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);
  let isNewUser = false;
  if (!user){
    if (!name || !name.trim()){
      return res.status(400).json({ error: "首次登录请填写姓名完成注册" });
    }
    const id = "u_" + uuidv4();
    db.prepare(`
      INSERT INTO users (id, name, phone, role, free_posts_remaining, created_at)
      VALUES (?,?,?,'user',1,?)
    `).run(id, name.trim(), phone, new Date().toISOString());
    user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    isNewUser = true;
  }
  const token = signToken(user.id);
  res.json({ token, user: publicUser(user), isNewUser });
});

/* ---------- 管理员：验证码登录/注册(需邀请码) ---------- */
router.post("/admin/otp/verify", (req, res)=>{
  const phone = normalizePhone(req.body.phone);
  const { code, name, inviteCode } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "请填写完整信息" });

  const check = checkOtp(phone, code);
  if (!check.ok) return res.status(400).json({ error: check.error });

  /* 管理员邀请码每次登录都要校验，不管是首次注册还是已有账号登录，
     不像普通用户那样只在注册那一次卡一道门 */
  const validInvite = process.env.ADMIN_INVITE_CODE && inviteCode === process.env.ADMIN_INVITE_CODE;
  if (!validInvite){
    return res.status(403).json({ error: "邀请码不正确" });
  }

  let user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);

  if (user){
    if (user.role !== "admin"){
      return res.status(403).json({ error: "该手机号不是管理员账号" });
    }
  } else {
    if (!name || !name.trim()){
      return res.status(400).json({ error: "请填写姓名完成管理员注册" });
    }
    const id = "u_" + uuidv4();
    db.prepare(`
      INSERT INTO users (id, name, phone, role, free_posts_remaining, created_at)
      VALUES (?,?,?,'admin',0,?)
    `).run(id, name.trim(), phone, new Date().toISOString());
    user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  }
  const token = signToken(user.id);
  res.json({ token, user: publicUser(user) });
});

/* ---------- Google 登录 ---------- */
router.post("/google", async (req, res)=>{
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: "缺少 Google 登录凭证" });
  if (!process.env.GOOGLE_CLIENT_ID){
    return res.status(500).json({ error: "服务器尚未配置 GOOGLE_CLIENT_ID，请联系管理员" });
  }
  try{
    const { OAuth2Client } = require("google-auth-library");
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();

    let user = db.prepare("SELECT * FROM users WHERE google_id = ?").get(payload.sub);
    if (!user){
      const id = "u_" + uuidv4();
      db.prepare(`
        INSERT INTO users (id, name, google_id, email, role, free_posts_remaining, created_at)
        VALUES (?,?,?,?,'user',1,?)
      `).run(id, payload.name || payload.email, payload.sub, payload.email, new Date().toISOString());
      user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    }
    const token = signToken(user.id);
    res.json({ token, user: publicUser(user) });
  }catch(e){
    console.error(e);
    res.status(401).json({ error: "Google 登录验证失败" });
  }
});

router.get("/me", authRequired, (req, res)=>{
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
  if (!user) return res.status(404).json({ error: "用户不存在" });
  res.json({ user: publicUser(user) });
});

module.exports = router;
