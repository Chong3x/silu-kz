const express = require("express");
const router = express.Router();
const db = require("../db");
const { authRequired, adminRequired } = require("../middleware/auth");

/* 管理后台顶部的总览数字：总用户数 + 5项待处理数量。
   全部是对已有字段做计数查询，不涉及任何数据结构改动。 */
router.get("/stats", authRequired, adminRequired, (req, res)=>{
  const totalUsers = db.prepare("SELECT COUNT(*) AS c FROM users").get().c;
  const totalAdmins = db.prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'admin'").get().c;
  const pendingPayment = db.prepare("SELECT COUNT(*) AS c FROM listings WHERE status = 'pending_payment'").get().c;
  const newListings = db.prepare("SELECT COUNT(*) AS c FROM listings WHERE status = 'pending' AND approved_at IS NULL").get().c;
  const editedListings = db.prepare("SELECT COUNT(*) AS c FROM listings WHERE status = 'pending' AND approved_at IS NOT NULL").get().c;
  const pendingFeedback = db.prepare("SELECT COUNT(*) AS c FROM feedback WHERE status = 'pending'").get().c;
  const pendingReferrals = db.prepare("SELECT COUNT(*) AS c FROM referral_submissions WHERE status = 'pending'").get().c;

  res.json({
    totalUsers,
    totalAdmins,
    pendingPayment,
    newListings,
    editedListings,
    pendingFeedback,
    pendingReferrals
  });
});

module.exports = router;
