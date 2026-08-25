# 丝路驿站 · Silk Road Post

哈萨克斯坦华人信息发布平台。现在包含完整的用户系统、广告审核与到期流程、反馈系统、分享奖励、Kaspi 转账确认。

```
kz-site/
├── package.json
├── .env.example
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── lib/
│   │   ├── otpProvider.js   ← 短信验证码发送(默认开发模式，打印到终端)
│   │   └── jobs.js           ← 后台定时任务(广告到期/提醒/截图清理)
│   ├── middleware/auth.js
│   ├── routes/                auth / listings / favorites / feedback / referrals / notifications
│   └── uploads/
└── frontend/
    ├── index.html / favorites.html / profile.html / post.html
    ├── login.html / admin-login.html / admin.html
    ├── feedback.html / referral.html
    └── style.css / config.js / common.js / *.js
```

---

## 一、本地运行

```bash
npm install
cp .env.example .env
```

打开 `.env`，至少要改这几项：

| 变量 | 说明 |
|---|---|
| `JWT_SECRET` | 随机字符串，生成方法见下方 |
| `ADMIN_INVITE_CODE` | 管理员注册邀请码，自己设一个 |
| `KASPI_PHONE` / `KASPI_NAME` | 展示给用户的收款信息 |
| `OTP_DEV_MODE` | 先保持 `true`，这样测试时不用真的接短信服务商，验证码会直接打印在后端终端里 |

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
用这个命令生成的字符串填到 `JWT_SECRET`。

```bash
npm start
```
打开 `http://localhost:3000`。首次注册/登录时，去获取验证码后**看终端窗口**，验证码会打印在那里（例如 `📱 [开发模式] 发送到 +7xxx 的验证码是: 123456`），页面上也会用小字提示同样的内容方便测试。

### 想先看看首页填满数据是什么样子？

```bash
npm run seed
```
会往数据库里插入16条示例广告（8个分类各2条，剩余天数从1天到25天都有，方便你看到绿/黄/红三种到期提示的效果），不用真的走注册发布流程。这些数据只是用来预览布局的，正式上线前记得把 `backend/data.sqlite` 删掉重新开始。

---

## 二、三个还需要你自己申请账号的功能

这三个功能涉及第三方账号，我没法替你注册，但代码都已经写好并测试过，你申请到账号后照着填环境变量就能用。

### 1. 手机验证码短信
现在是"开发模式"：验证码只打印在服务器日志里，不会真的发短信。要正式发短信，需要：
1. 找一家短信服务商（哈萨克斯坦本地的比如 smsc.kz、mobizon.kz，或者国际的 Twilio 都可以）
2. 打开 `backend/lib/otpProvider.js`，把里面注释掉的示例代码换成你选的服务商的真实 API 调用
3. 把 `.env` 里的 `OTP_DEV_MODE` 改成 `false`

### 2. Google 登录
1. 打开 Google Cloud Console 的凭据页面 (console.cloud.google.com/apis/credentials)
2. 创建一个 OAuth 客户端 ID，应用类型选 "Web 应用"
3. 在"已授权的 JavaScript 来源"里加上你的网址（本地是 `http://localhost:3000`，Railway 部署后是你的 Railway 域名）
4. 把生成的 Client ID 填到 `.env` 的 `GOOGLE_CLIENT_ID`

不填的话，Google 登录按钮就不会显示，不影响手机验证码登录正常使用。

### 3. Kaspi 收款
目前是"转账截图 + 人工确认"的方式(按你的要求，没有接 Kaspi Pay 官方 API)。只需要把你自己的 Kaspi 手机号和收款人姓名填到 `.env` 的 `KASPI_PHONE` / `KASPI_NAME`，用户发布付费广告时就会看到这些信息，转账后上传截图，你在管理后台确认收款即可。

---

## 三、管理员怎么进入后台

1. 打开 `/admin-login.html`（首页没有入口链接，这是有意设计成不对外暴露的独立入口）
2. 用你自己的手机号获取验证码，同时填写"管理员邀请码"（就是 `.env` 里的 `ADMIN_INVITE_CODE`）完成注册
3. 以后再登录同一个手机号，就不需要再填邀请码和姓名了，直接验证码登录
4. 登录后头部会出现"管理后台"入口，或者直接访问 `/admin.html`

管理后台四个标签页：**待确认付款**（核对Kaspi转账截图）→ **待审核广告**（审核内容，通过/拒绝）→ **意见反馈**（只能标记状态，不能改用户写的内容）→ **分享审核**（核实分享截图，通过后自动给用户加1次免费发布）。

---

## 四、广告状态流转

```
免费发布 ──────────────────────┐
                                ├─→ pending(审核中) ─→ active(已上线，开始计时) ─→ expired(自动下架)
付费发布 ─→ pending_payment ────┘         │
      (等待管理员确认收款)                  └─→ rejected(拒绝，附带原因)
```

- 广告卡片右上角/底部会显示剩余天数：**大于7天绿色，3-7天黄色，≤3天红色并标注"即将过期"**
- 到期前3天，系统会在用户的通知铃铛里推送一条提醒（站内通知已实现；短信/邮件提醒的接口留了空位在 `backend/lib/jobs.js` 里，接入短信服务商后可以顺手一起加上）
- 到期后自动改成 `expired`，从首页消失，但用户自己在"我的发布"里还能看到

后台任务每小时跑一次（`backend/lib/jobs.js`），服务器启动时也会先跑一次，不需要额外配置定时任务工具。

---

## 五、部署到 Railway

跟之前一样：GitHub 仓库 → Railway 新建项目 → 加 Volume 挂到 `/data` 防止数据丢失 → 环境变量记得把这次新增的这些也加上：

```
JWT_SECRET=（新生成一个，不要跟本地一样）
ADMIN_INVITE_CODE=
KASPI_PHONE=
KASPI_NAME=
GOOGLE_CLIENT_ID=（如果配置了Google登录）
OTP_DEV_MODE=true（正式接入短信服务商之前先保持true，不然验证码发不出去也收不到）
DB_PATH=/data/data.sqlite
UPLOADS_DIR=/data/uploads
```

## 六、诚实的边界说明

- 反馈系统按要求做成"管理员只能标记状态，不能编辑用户写的内容"。
- 分享截图审核通过/拒绝后，超过约4个月(120天，在你要求的3-6个月区间内)会被后台任务自动删除文件本身，释放硬盘空间，但审核记录还在。
- 免费广告目前默认发布周期是10天（和付费的10天档一致），如果你想让免费广告用不同的周期，告诉我改一下就行。
- 这依然是 SQLite + 单机部署的 MVP 架构，适合起步阶段；等用户量上来需要多实例、真正的支付网关(Kaspi Pay API)或短信服务商大规模对接时，欢迎回来找我升级。
