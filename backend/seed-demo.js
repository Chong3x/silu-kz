/* ========================================================
   seed-demo.js — 生成有代表性的示例数据，方便预览首页各种布局状态
   用法: npm run seed
   （会创建一个演示账号 demo@example.com 和一批 active 状态的示例广告，
    直接写入数据库、跳过审核流程，仅用于本地查看效果，不影响真实数据结构）
   ======================================================== */
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const db = require("./db");

const CITIES = ["almaty", "astana", "shymkent"];

const DEMO_LISTINGS = [
  { category:"secondhand", city:"almaty", contact:"WeChat: kz_lily88",
    title:"九成新自行车转让，带锁和车灯", desc:"搬家急出，捷安特山地车，骑了不到半年，非常新，价格可小刀。", days:12 },
  { category:"secondhand", city:"astana", contact:"WhatsApp: +7 707 123 4567",
    title:"闲置婴儿推车、婴儿床低价出", desc:"孩子长大不用了，德国进口品牌，成色很好，能小刀，可上门自提。", days:2 },

  { category:"rental", city:"almaty", contact:"电话: +7 701 234 5678",
    title:"市中心两居室出租，拎包入住", desc:"家具家电齐全，近地铁站，采光好，适合情侣或小家庭，可签一年合同。", days:20 },
  { category:"rental", city:"shymkent", contact:"微信: shymkent_home",
    title:"带小院独栋出租，适合有孩子的家庭", desc:"三室一厅带院子，靠近华人市场和国际学校，月租可议。", days:5 },

  { category:"jobs", city:"almaty", contact:"邮箱: hr@example-kz.com",
    title:"招聘中俄双语客服专员", desc:"贸易公司招聘客服，负责对接国内供应商与本地客户，五险一金，双休。", days:15 },
  { category:"jobs", city:"astana", contact:"WhatsApp: +7 700 234 5678",
    title:"会计专业毕业生求职", desc:"熟悉中俄双语，有本地实习经验，可立即上岗，期望在贸易或财务岗位。", days:1 },

  { category:"services", city:"almaty", contact:"微信: service_kz01",
    title:"提供中俄哈三语翻译陪同服务", desc:"可陪同商务谈判、医院、政府部门办事，按小时或按天计费，经验丰富。", days:25 },
  { category:"services", city:"shymkent", contact:"电话: +7 702 345 6789",
    title:"上门家电维修，价格公道", desc:"冰箱、洗衣机、空调维修，多年经验，修不好不收费。", days:8 },

  { category:"treasure", city:"almaty", contact:"Instagram: @almaty_hidden_gem",
    title:"藏在小巷里的正宗兰州拉面馆", desc:"本地华人开的小馆子，汤头很正，价格实惠，就是位置比较难找，值得专门跑一趟。", days:18 },
  { category:"treasure", city:"astana", contact:"微信: astana_foodie",
    title:"推荐一家宝藏中式烘焙店", desc:"老板是东北人，做的桃酥和月饼特别地道，逢年过节要提前预订。", days:6 },

  { category:"shopads", city:"almaty", contact:"电话: +7 705 456 7890",
    title:"华人超市新店开业，全场8折", desc:"新店位于市中心商圈，主营国内调料、零食、日用品，欢迎光临。", days:10 },
  { category:"shopads", city:"shymkent", contact:"WhatsApp: +7 706 567 8901",
    title:"中式快剪理发店开业酬宾", desc:"专业理发师，会中文沟通，学生价，环境干净，提前预约优先。", days:3 },

  { category:"partner", city:"astana", contact:"邮箱: biz@example-kz.com",
    title:"寻找建材类当地合作商", desc:"国内工厂直供，寻找哈方渠道商共同拓展市场，欢迎详谈合作模式。", days:22 },
  { category:"partner", city:"almaty", contact:"微信: trade_partner_kz",
    title:"跨境电商仓储物流合作", desc:"寻找阿拉木图本地仓储资源，长期合作，量大从优，可签框架协议。", days:4 },

  { category:"other", city:"almaty", contact:"微信: other_kz01",
    title:"寻找拼车伙伴，阿拉木图往返奇姆肯特", desc:"每月固定往返一次，希望能拼车分摊油费，路上也有个伴。", days:14 },
  { category:"other", city:"astana", contact:"电话: +7 707 678 9012",
    title:"求推荐靠谱的搬家公司", desc:"下个月搬家，找个信得过、不乱加价的搬家公司，有经验的朋友推荐一下。", days:7 }
];

function ensureDemoUser(){
  const existing = db.prepare("SELECT * FROM users WHERE phone = ?").get("+70000000000");
  if (existing) return existing;
  const id = "u_" + uuidv4();
  const hash = bcrypt.hashSync("demo123456", 10);
  db.prepare(`
    INSERT INTO users (id, name, phone, role, free_posts_remaining, created_at)
    VALUES (?,?,?,?,?,?)
  `).run(id, "演示用户", "+70000000000", "user", 1, new Date().toISOString());
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

function seed(){
  const user = ensureDemoUser();
  let inserted = 0;

  const listingColumns = db.prepare("PRAGMA table_info(listings)").all().map(c => c.name);
  const hasLegacyJsonColumns = listingColumns.includes("title_json") && listingColumns.includes("desc_json");

  for (const item of DEMO_LISTINGS){
    const id = "l_" + uuidv4();
    const now = Date.now();
    const createdAt = new Date(now - 3 * 86400000).toISOString();
    const expiresAt = new Date(now + item.days * 86400000).toISOString();

    if (hasLegacyJsonColumns){
      const titleJson = JSON.stringify({ zh:item.title, ru:item.title, kk:item.title, en:item.title });
      const descJson = JSON.stringify({ zh:item.desc, ru:item.desc, kk:item.desc, en:item.desc });
      db.prepare(`
        INSERT INTO listings
          (id, user_id, category, city, contact, title, description, title_json, desc_json, status, plan_days, payment_amount, approved_at, expires_at, created_at)
        VALUES (?,?,?,?,?,?,?,?,?, 'active', 10, NULL, ?, ?, ?)
      `).run(id, user.id, item.category, item.city, item.contact, item.title, item.desc, titleJson, descJson, createdAt, expiresAt, createdAt);
    } else {
      db.prepare(`
        INSERT INTO listings
          (id, user_id, category, city, contact, title, description, status, plan_days, payment_amount, approved_at, expires_at, created_at)
        VALUES (?,?,?,?,?,?,?, 'active', 10, NULL, ?, ?, ?)
      `).run(id, user.id, item.category, item.city, item.contact, item.title, item.desc, createdAt, expiresAt, createdAt);
    }
    inserted++;
  }

  console.log(`✅ 已插入 ${inserted} 条示例广告 (演示账号手机号: +70000000000，密码: demo123456)`);
  console.log("提示：这些示例数据仅用于本地预览布局，正式上线前建议清空 backend/data.sqlite 重新开始。");
}

seed();
