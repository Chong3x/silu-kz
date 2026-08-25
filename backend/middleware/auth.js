const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

function getTokenFromHeader(req){
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

/* 必须登录才能访问的路由 */
function authRequired(req, res, next){
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ error: "未登录，请先登录" });
  try{
    const payload = jwt.verify(token, SECRET);
    /* 光验证Token本身签名有效还不够，还要确认这个用户在数据库里真实存在——
       如果本地数据库被重置过、或者账号被删除了，Token可能看起来还是对的，
       但对应的用户已经不存在了。这种情况直接当成"登录过期"处理，返回清楚的提示，
       不要让后面的代码拿着一个不存在的用户ID去写数据库，那样会报出很难看的原始错误。 */
    const db = require("../db");
    const userExists = db.prepare("SELECT 1 FROM users WHERE id = ?").get(payload.userId);
    if (!userExists){
      return res.status(401).json({ error: "登录已过期，请重新登录" });
    }
    req.userId = payload.userId;
    next();
  }catch(e){
    return res.status(401).json({ error: "登录已过期，请重新登录" });
  }
}

/* 登录可选（有 token 就解析出用户，没有也放行）*/
function authOptional(req, res, next){
  const token = getTokenFromHeader(req);
  if (token){
    try{
      const payload = jwt.verify(token, SECRET);
      const db = require("../db");
      const userExists = db.prepare("SELECT 1 FROM users WHERE id = ?").get(payload.userId);
      if (userExists) req.userId = payload.userId;
      /* 用户不存在的话就当成没登录处理，不阻断这类"登录可选"的请求 */
    }catch(e){ /* 忽略无效 token */ }
  }
  next();
}

/* 必须是管理员才能访问的路由(需先经过 authRequired 拿到 req.userId) */
function adminRequired(req, res, next){
  const db = require("../db");
  const user = db.prepare("SELECT role FROM users WHERE id = ?").get(req.userId);
  if (!user || user.role !== "admin"){
    return res.status(403).json({ error: "仅管理员可访问" });
  }
  next();
}

module.exports = { authRequired, authOptional, adminRequired, SECRET };
