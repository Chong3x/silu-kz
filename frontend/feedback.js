/* ========== 意见反馈页逻辑 ========== */
document.getElementById("feedbackForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const t = translations[getLang()];
  const type = document.getElementById("fType").value;
  const content = document.getElementById("fContent").value.trim();
  const contact = document.getElementById("fContact").value.trim();
  const errorEl = document.getElementById("feedbackError");
  errorEl.classList.remove("show");

  if (!content){
    errorEl.textContent = t.errorFillAll;
    errorEl.classList.add("show");
    return;
  }
  const submitBtn = e.target.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  try{
    await submitFeedback(type, content, contact);
    showToast(t.feedbackThanks);
    e.target.reset();
  }catch(err){
    errorEl.textContent = err.message;
    errorEl.classList.add("show");
  }
  submitBtn.disabled = false;
});

markActiveNav("feedback");
initLangSwitcher(()=> renderAuthArea());
renderAuthArea();
