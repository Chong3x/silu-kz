/* ========================================================
   otpProvider.js — 发送手机验证码的统一接口
   ------------------------------------------------------
   OTP_DEV_MODE=true（默认）：不会真的发短信，只把验证码打印在
   后端终端日志里，方便本地测试。

   OTP_DEV_MODE=false：改用下面的 smsc.kz 真实接口发送短信，
   需要在 .env 里配置 SMSC_LOGIN 和 SMSC_PASSWORD
   （注册时设置的登录名和密码，smsc.kz 的基础HTTP接口直接用
   这一对账号密码做鉴权，不需要另外生成Key）。
   ======================================================== */

const DEV_MODE = (process.env.OTP_DEV_MODE || "true") === "true";

async function sendOtp(phone, code){
  if (DEV_MODE){
    console.log(`\n📱 [开发模式-验证码短信模拟] 发送到 ${phone} 的验证码是: ${code}\n`);
    return { ok: true, dev: true };
  }

  const login = process.env.SMSC_LOGIN;
  const password = process.env.SMSC_PASSWORD;
  if (!login || !password){
    throw new Error("短信服务未配置，请检查 .env 里的 SMSC_LOGIN / SMSC_PASSWORD");
  }

  const text = `您的验证码是: ${code}，5分钟内有效。`;
  const params = new URLSearchParams({
    login,
    psw: password,
    phones: phone,
    mes: text,
    fmt: "3",       // 返回JSON格式的结果，方便判断是否成功
    charset: "utf-8"
  });

  let data;
  try{
    const resp = await fetch(`https://smsc.kz/sys/send.php?${params.toString()}`);
    data = await resp.json();
  }catch(e){
    console.error("调用 smsc.kz 接口失败:", e);
    throw new Error("短信发送失败，请检查网络或稍后重试");
  }

  if (data.error){
    console.error("smsc.kz 返回错误:", data.error, "错误码:", data.error_code);
    throw new Error("短信发送失败: " + data.error);
  }

  return { ok: true };
}

module.exports = { sendOtp };
