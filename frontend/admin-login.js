/* ========== 管理员登录/注册页逻辑(登录与注册彻底分开的两个Tab) ========== */
function getRedirectTarget(){
  return new URLSearchParams(location.search).get("redirect") || "admin.html";
}

function showTab(which){
  const isLogin = which === "login";
  document.getElementById("tabLoginBtn").classList.toggle("active", isLogin);
  document.getElementById("tabRegisterBtn").classList.toggle("active", !isLogin);
  document.getElementById("loginForm").classList.toggle("active", isLogin);
  document.getElementById("registerForm").classList.toggle("active", !isLogin);
}
document.getElementById("tabLoginBtn").addEventListener("click", ()=> showTab("login"));
document.getElementById("tabRegisterBtn").addEventListener("click", ()=> showTab("register"));

/* 通用的"获取验证码"倒计时按钮逻辑，登录/注册各自独立一份 */
function wireSendCode(btnId, phoneInputId, devHintId){
  const btn = document.getElementById(btnId);
  btn.addEventListener("click", async ()=>{
    const phone = document.getElementById(phoneInputId).value.trim();
    const errorEl = btn.closest("form").querySelector(".error-msg");
    errorEl.classList.remove("show");
    if (!phone){
      errorEl.textContent = translations[getLang()].errorFillAll;
      errorEl.classList.add("show");
      return;
    }
    const result = await requestAdminOtp(phone);
    if (!result.ok){
      errorEl.textContent = result.error;
      errorEl.classList.add("show");
      return;
    }
    let remaining = 60;
    const t = translations[getLang()];
    btn.disabled = true;
    btn.textContent = t.otpResend.replace("{n}", remaining);
    const timer = setInterval(()=>{
      remaining--;
      if (remaining <= 0){
        clearInterval(timer);
        btn.disabled = false;
        btn.textContent = t.otpSendBtn;
      } else {
        btn.textContent = t.otpResend.replace("{n}", remaining);
      }
    }, 1000);
    const devHint = document.getElementById(devHintId);
    if (result.dev && result.devCode){
      devHint.hidden = false;
      devHint.textContent = t.devOtpHint.replace("{code}", result.devCode);
    }
  });
}
wireSendCode("loginSendCodeBtn", "loginPhoneInput", "loginDevHint");
wireSendCode("registerSendCodeBtn", "registerPhoneInput", "registerDevHint");

/* ---------- 登录：手机号+验证码+邀请码，不需要姓名(已有账号) ---------- */
document.getElementById("loginForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const t = translations[getLang()];
  const phone = document.getElementById("loginPhoneInput").value.trim();
  const code = document.getElementById("loginCodeInput").value.trim();
  const inviteCode = document.getElementById("loginInviteInput").value.trim();
  const errorEl = document.getElementById("loginError");
  errorEl.classList.remove("show");

  if (!phone || !code || !inviteCode){
    errorEl.textContent = t.errorFillAll;
    errorEl.classList.add("show");
    return;
  }
  const submitBtn = e.target.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  const result = await verifyAdminOtp(phone, code, "", inviteCode);
  submitBtn.disabled = false;

  if (!result.ok){
    /* 这个手机号还没注册过管理员账号，提示去注册Tab，而不是在登录Tab里硬凑 */
    if (result.error && result.error.includes("请填写姓名完成管理员注册")){
      errorEl.textContent = t.errorFillAll + "（" + t.tabRegister + "？）";
      showTab("register");
      document.getElementById("registerPhoneInput").value = phone;
      document.getElementById("registerInviteInput").value = inviteCode;
    } else {
      errorEl.textContent = result.error;
      errorEl.classList.add("show");
    }
    return;
  }
  location.href = getRedirectTarget();
});

/* ---------- 注册：手机号+验证码+姓名+邀请码，独立完成开户 ---------- */
document.getElementById("registerForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const t = translations[getLang()];
  const phone = document.getElementById("registerPhoneInput").value.trim();
  const code = document.getElementById("registerCodeInput").value.trim();
  const name = document.getElementById("registerNameInput").value.trim();
  const inviteCode = document.getElementById("registerInviteInput").value.trim();
  const errorEl = document.getElementById("registerError");
  errorEl.classList.remove("show");

  if (!phone || !code || !name || !inviteCode){
    errorEl.textContent = t.errorFillAll;
    errorEl.classList.add("show");
    return;
  }
  const submitBtn = e.target.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  const result = await verifyAdminOtp(phone, code, name, inviteCode);
  submitBtn.disabled = false;

  if (!result.ok){
    errorEl.textContent = result.error;
    errorEl.classList.add("show");
    return;
  }
  location.href = getRedirectTarget();
});

if (getCurrentUser() && getCurrentUser().role === "admin"){
  location.href = getRedirectTarget();
} else {
  initLangSwitcher(()=> renderAuthArea());
  renderAuthArea();
}
