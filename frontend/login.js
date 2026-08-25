/* ========== 登录/注册页逻辑(登录与注册彻底分开的两个Tab) ========== */
function getRedirectTarget(){
  return new URLSearchParams(location.search).get("redirect") || "index.html";
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
  let timer = null;
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
    const result = await requestOtp(phone);
    if (!result.ok){
      errorEl.textContent = result.error;
      errorEl.classList.add("show");
      return;
    }
    let remaining = 60;
    const t = translations[getLang()];
    btn.disabled = true;
    btn.textContent = t.otpResend.replace("{n}", remaining);
    timer = setInterval(()=>{
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

/* ---------- 登录：只允许已注册手机号，不在这里创建新账号 ---------- */
document.getElementById("loginForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const t = translations[getLang()];
  const phone = document.getElementById("loginPhoneInput").value.trim();
  const code = document.getElementById("loginCodeInput").value.trim();
  const errorEl = document.getElementById("loginError");
  errorEl.classList.remove("show");

  if (!phone || !code){
    errorEl.textContent = t.errorFillAll;
    errorEl.classList.add("show");
    return;
  }
  const submitBtn = e.target.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  const result = await verifyOtp(phone, code); // 不传姓名：新手机号会报错，提示去注册
  submitBtn.disabled = false;

  if (!result.ok){
    if (result.error && result.error.includes("首次登录请填写姓名")){
      errorEl.textContent = t.errorFillAll + "（" + t.tabRegister + "？）";
      showTab("register");
      document.getElementById("registerPhoneInput").value = phone;
    } else {
      errorEl.textContent = result.error;
      errorEl.classList.add("show");
    }
    return;
  }
  location.href = getRedirectTarget();
});

/* ---------- 注册：手机号+验证码+姓名，独立完成开户 ---------- */
document.getElementById("registerForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const t = translations[getLang()];
  const phone = document.getElementById("registerPhoneInput").value.trim();
  const code = document.getElementById("registerCodeInput").value.trim();
  const name = document.getElementById("registerNameInput").value.trim();
  const errorEl = document.getElementById("registerError");
  errorEl.classList.remove("show");

  if (!phone || !code || !name){
    errorEl.textContent = t.errorFillAll;
    errorEl.classList.add("show");
    return;
  }
  const submitBtn = e.target.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  const result = await verifyOtp(phone, code, name);
  submitBtn.disabled = false;

  if (!result.ok){
    errorEl.textContent = result.error;
    errorEl.classList.add("show");
    return;
  }
  location.href = getRedirectTarget();
});

/* ---------- Google 登录(登录/注册通用，一步到位) ---------- */
async function initGoogleButton(){
  const config = await fetchPublicConfig();
  if (!config.googleClientId) return;
  if (!window.google || !window.google.accounts){
    setTimeout(initGoogleButton, 300);
    return;
  }
  window.google.accounts.id.initialize({
    client_id: config.googleClientId,
    callback: async (response)=>{
      const result = await loginWithGoogle(response.credential);
      if (result.ok){
        location.href = getRedirectTarget();
      } else {
        const errorEl = document.getElementById("loginError");
        errorEl.textContent = result.error;
        errorEl.classList.add("show");
      }
    }
  });
  const wrapEl = document.getElementById("googleBtnWrap");
  const btnWidth = Math.min(wrapEl.offsetWidth || 360, 360);
  const googleLocaleMap = { zh:"zh-CN", ru:"ru", kk:"kk", en:"en" };
  wrapEl.innerHTML = "";
  window.google.accounts.id.renderButton(wrapEl, {
    theme: "outline", size: "large", width: btnWidth, locale: googleLocaleMap[getLang()] || "en"
  });
}
if (getCurrentUser()){
  location.href = getRedirectTarget();
} else {
  initLangSwitcher(()=>{ renderAuthArea(); initGoogleButton(); });
  renderAuthArea();
  initGoogleButton();
}
