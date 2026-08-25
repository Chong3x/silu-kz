const express = require("express");
const router = express.Router();
const db = require("../db");
const { authRequired } = require("../middleware/auth");

router.get("/", authRequired, (req, res)=>{
  const rows = db.prepare("SELECT listing_id FROM favorites WHERE user_id = ?").all(req.userId);
  res.json({ favoriteIds: rows.map(r=>r.listing_id) });
});

router.post("/:listingId", authRequired, (req, res)=>{
  db.prepare("INSERT OR IGNORE INTO favorites (user_id, listing_id) VALUES (?,?)")
    .run(req.userId, req.params.listingId);
  res.json({ ok: true, favorited: true });
});

router.delete("/:listingId", authRequired, (req, res)=>{
  db.prepare("DELETE FROM favorites WHERE user_id = ? AND listing_id = ?")
    .run(req.userId, req.params.listingId);
  res.json({ ok: true, favorited: false });
});

module.exports = router;
