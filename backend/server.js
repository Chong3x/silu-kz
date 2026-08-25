require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { startJobs } = require("./lib/jobs");

const app = express();

/* Railway(以及大多数托管平台)是通过反向代理转发请求的，
   不开这个的话 req.ip 拿到的是代理自己的IP，不是真实用户的IP */
app.set("trust proxy", true);

const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map(s=>s.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true
}));

app.use(express.json());

const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsDir));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/listings", require("./routes/listings"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/referrals", require("./routes/referrals"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/admin", require("./routes/admin"));
app.get("/api/health", (req, res)=> res.json({ ok:true, message:"Silk Road Post backend is running" }));
app.get("/api/public-config", (req, res)=>{
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    kaspiPhone: process.env.KASPI_PHONE || "",
    kaspiName: process.env.KASPI_NAME || ""
  });
});

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use((err, req, res, next)=>{
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "服务器出错了" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log(`✅ 丝路驿站已启动: http://localhost:${PORT}`);
  startJobs();
});
