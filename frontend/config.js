/* ========================================================
   config.js — 前端配置
   由于后端(Express)已经把前端页面和 API 放在同一个网址下提供，
   这里用相对路径 "/api" 就行，本地开发和部署到 Railway 后都不用改。

   仅当你把前端单独部署到别的地方（比如 Netlify/Vercel），
   跟后端不是同一个网址时，才需要把下面这行换成完整地址，例如：
   const API_BASE = "https://your-app-name.up.railway.app/api";
   ======================================================== */
const API_BASE = "/api";

/* 用于拼接图片路径 /uploads/xxx.jpg，同源部署时留空字符串即可 */
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");
