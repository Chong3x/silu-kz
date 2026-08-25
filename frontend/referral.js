/* ========== 分享有礼页逻辑(需要登录) ========== */
const MAX_SCREENSHOT_MB = 2;

function renderUploadForm(t){
  const area = document.getElementById("referralArea");
  area.innerHTML = `
    <form id="referralForm" class="form-card" style="padding:24px;">
      <div class="field-group">
        <label data-i18n="referralUploadLabel">上传分享截图(不超过2MB)</label>
        <input type="file" id="fScreenshot" accept="image/*" required>
      </div>
      <p class="error-msg" id="referralError"></p>
      <div class="form-actions" style="justify-content:stretch;">
        <button type="submit" class="btn btn-post" style="width:100%; justify-content:center;" data-i18n="referralSubmitBtn">提交审核</button>
      </div>
    </form>`;
  applyTranslations(getLang());

  document.getElementById("referralForm").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const errorEl = document.getElementById("referralError");
    errorEl.classList.remove("show");
    const file = document.getElementById("fScreenshot").files[0];
    if (!file){
      errorEl.textContent = t.errorFillAll;
      errorEl.classList.add("show");
      return;
    }
    if (file.size > MAX_SCREENSHOT_MB * 1024 * 1024){
      errorEl.textContent = t.toastMaxPhotos;
      errorEl.classList.add("show");
      return;
    }
    const submitBtn = e.target.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    try{
      await submitReferral(file);
      showToast(t.referralSubmitted);
      renderStatusBox(t, "pending");
    }catch(err){
      errorEl.textContent = err.message;
      errorEl.classList.add("show");
      submitBtn.disabled = false;
    }
  });
}

function renderStatusBox(t, status){
  const area = document.getElementById("referralArea");
  const map = {
    pending: t.referralStatusPending,
    approved: t.referralStatusApproved,
    rejected: t.referralStatusRejected
  };
  area.innerHTML = `<div class="referral-status-box">${map[status] || status}</div>`;
}

async function initReferralPage(){
  const t = translations[getLang()];
  const user = getCurrentUser();
  if (!user) return;

  if (user.referralRewardGranted){
    renderStatusBox(t, "approved");
    return;
  }
  try{
    const submissions = await fetchMyReferrals();
    const active = submissions.find(s => s.status === "pending");
    if (active){
      renderStatusBox(t, "pending");
      return;
    }
    renderUploadForm(t);
  }catch(e){
    renderUploadForm(t);
  }
}

const user = requireAuth("referral.html");
if (user){
  markActiveNav("referral");
  initLangSwitcher(()=>{ renderAuthArea(); initReferralPage(); });
  renderAuthArea();
  initReferralPage();
}
