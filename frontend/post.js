/* ========== 发布/编辑信息页逻辑(需要登录) ========== */
const MAX_PHOTOS = 4;
let existingPhotos = [];   // 编辑模式下，服务器已有的图片 url（相对路径）
let newFiles = [];         // 本次新选择、还未上传的图片 File 对象
let editingId = null;
let selectedPlan = null;   // 'free' | '10' | '30'
let paymentScreenshotFile = null;

function getQueryParam(name){
  return new URLSearchParams(location.search).get(name);
}

function populateSelects(lang){
  document.getElementById("fCategory").innerHTML =
    categories.map(c => `<option value="${c.id}">${c.name[lang]}</option>`).join("");
  document.getElementById("fCity").innerHTML =
    Object.keys(cities).map(id => `<option value="${id}">${cities[id][lang]}</option>`).join("");
}

/* "私藏推荐"分类完全免费、不用选方案，也不需要联系方式(读者是自己去店里，不是联系发布人)：
   切到这个分类就把方案选择、Kaspi付款区块、联系方式输入框都藏起来，换成一句免费提示；
   切到别的分类再恢复正常流程 */
/* 小工具：安全地设置某个元素的hidden/required属性，元素万一不存在也不会报错、
   不会连累后面的代码继续执行 —— 避免"一个元素找不到，后面该隐藏的东西全都来不及隐藏"这种问题 */
function safeSetHidden(id, hidden){
  const el = document.getElementById(id);
  if (el) el.hidden = hidden;
}
function safeSetRequired(id, required){
  const el = document.getElementById(id);
  if (el) el.required = required;
}

function updateTreasureFreeMode(){
  if (editingId) return; // 编辑模式下方案区块本来就是隐藏的，不用管
  const category = document.getElementById("fCategory").value;
  const isTreasure = category === "treasure";

  /* 最要紧的两件事先做：付费方案区块、付款框，必须先正确隐藏/显示，
     不能因为下面某个次要提示元素找不到就连累这两个关键区块 */
  safeSetHidden("planSection", isTreasure);
  if (isTreasure){
    selectedPlan = "free";
    safeSetHidden("kaspiBox", true);
  } else {
    updateKaspiBoxVisibility();
  }

  /* 这两个是辅助性的提示元素，就算意外找不到也不该影响上面核心逻辑的执行 */
  safeSetHidden("treasureFreeBanner", !isTreasure);
  safeSetHidden("contactGroup", isTreasure);
  safeSetRequired("fContact", !isTreasure);
}
document.getElementById("fCategory").addEventListener("change", updateTreasureFreeMode);

/* ---------- 发布方案选择(免费 / 10天 / 30天) ---------- */
async function renderPlanOptions(lang){
  const t = translations[lang];
  const user = getCurrentUser();
  const freeLeft = user ? user.freePostsRemaining : 0;
  const wrap = document.getElementById("planOptions");

  const options = [
    { value:"free", label: freeLeft > 0 ? t.planFree.replace("{n}", freeLeft) : t.planNoFree, disabled: freeLeft <= 0 },
    { value:"10", label: t.plan10, disabled:false },
    { value:"30", label: t.plan30, disabled:false }
  ];
  wrap.innerHTML = options.map(o=>`
    <label class="plan-option ${o.disabled ? 'disabled':''}" data-plan="${o.value}">
      <input type="radio" name="plan" value="${o.value}" ${o.disabled ? 'disabled':''}>
      <span class="plan-label">${o.label}</span>
    </label>`).join("");

  wrap.querySelectorAll("input[name=plan]").forEach(input=>{
    input.addEventListener("change", ()=>{
      selectedPlan = input.value;
      wrap.querySelectorAll(".plan-option").forEach(el=>el.classList.remove("selected"));
      input.closest(".plan-option").classList.add("selected");
      updateKaspiBoxVisibility();
    });
  });

  // 默认选中：有免费次数就默认免费，否则默认10天
  const defaultOption = freeLeft > 0 ? wrap.querySelector('input[value="free"]') : wrap.querySelector('input[value="10"]');
  if (defaultOption){
    defaultOption.checked = true;
    selectedPlan = defaultOption.value;
    defaultOption.closest(".plan-option").classList.add("selected");
  }
  updateKaspiBoxVisibility();
}

async function updateKaspiBoxVisibility(){
  const kaspiBox = document.getElementById("kaspiBox");
  if (!kaspiBox) return;
  const category = document.getElementById("fCategory").value;
  if (category === "treasure"){
    kaspiBox.hidden = true; // 私藏推荐分类：不管是谁调用这个函数、调用的时机早晚，永远不显示付款框
    return;
  }
  const needsPayment = selectedPlan === "10" || selectedPlan === "30";
  kaspiBox.hidden = !needsPayment;
  if (needsPayment){
    const config = await fetchPublicConfig();
    document.getElementById("kaspiPhoneVal").textContent = config.kaspiPhone || "-";
    document.getElementById("kaspiNameVal").textContent = config.kaspiName || "-";
  }
}

document.getElementById("fPaymentScreenshot").addEventListener("change", (e)=>{
  paymentScreenshotFile = (e.target.files && e.target.files[0]) || null;
});

function totalPhotoCount(){ return existingPhotos.length + newFiles.length; }

function renderPhotoPreviews(){
  const wrap = document.getElementById("photoPreviews");
  const existingThumbs = existingPhotos.map((url, i)=>`
    <div class="photo-thumb">
      <img src="${API_ORIGIN}${url}" alt="">
      <button type="button" data-remove-existing="${i}" aria-label="remove">✕</button>
    </div>`);
  const newThumbs = newFiles.map((file, i)=>`
    <div class="photo-thumb">
      <img src="${URL.createObjectURL(file)}" alt="">
      <button type="button" data-remove-new="${i}" aria-label="remove">✕</button>
    </div>`);
  wrap.innerHTML = existingThumbs.join("") + newThumbs.join("");

  wrap.querySelectorAll("[data-remove-existing]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      existingPhotos.splice(parseInt(btn.getAttribute("data-remove-existing"),10), 1);
      renderPhotoPreviews();
    });
  });
  wrap.querySelectorAll("[data-remove-new]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      newFiles.splice(parseInt(btn.getAttribute("data-remove-new"),10), 1);
      renderPhotoPreviews();
    });
  });
}

document.getElementById("fPhotos").addEventListener("change", (e)=>{
  addNewFiles(Array.from(e.target.files || []));
  e.target.value = "";
});

function addNewFiles(files){
  const t = translations[getLang()];
  for (const file of files){
    if (!file.type.startsWith("image/")) continue;
    if (totalPhotoCount() >= MAX_PHOTOS){
      showToast(t.toastMaxPhotos);
      break;
    }
    newFiles.push(file);
  }
  renderPhotoPreviews();
}

const dropZone = document.getElementById("photoDrop");
["dragenter","dragover"].forEach(evt=>{
  dropZone.addEventListener(evt, (e)=>{ e.preventDefault(); dropZone.classList.add("dragging"); });
});
["dragleave","drop"].forEach(evt=>{
  dropZone.addEventListener(evt, (e)=>{ e.preventDefault(); dropZone.classList.remove("dragging"); });
});
dropZone.addEventListener("drop", (e)=>{
  const files = Array.from(e.dataTransfer.files || []);
  addNewFiles(files);
});

async function loadListingForEdit(id, lang){
  try{
    const listing = await fetchListing(id);
    const user = getCurrentUser();
    if (!user || listing.userId !== user.id){
      alert(translations[lang].loginRequiredMsg);
      location.href = "profile.html";
      return;
    }
    editingId = id;
    document.getElementById("formHeading").textContent = translations[lang].postTitleEdit;
    document.getElementById("submitBtn").textContent = translations[lang].formSave;
    document.getElementById("submitBtn").setAttribute("data-i18n", "formSave");
    document.getElementById("fCategory").value = listing.category;
    document.getElementById("fCity").value = listing.city;
    document.getElementById("fContact").value = listing.contact;
    document.getElementById("fTitle").value = listing.title || "";
    document.getElementById("fDesc").value = listing.desc || "";
    existingPhotos = (listing.photos || []).slice();
    newFiles = [];
    renderPhotoPreviews();
    // 编辑模式下不重新走付费流程，隐藏方案选择
    safeSetHidden("planSection", true);
    safeSetHidden("kaspiBox", true);
    safeSetHidden("treasureFreeBanner", listing.category !== "treasure");
    safeSetHidden("contactGroup", listing.category === "treasure");
    safeSetRequired("fContact", listing.category !== "treasure");
  }catch(e){
    alert(e.message);
    location.href = "profile.html";
  }
}

document.getElementById("postForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const user = getCurrentUser();
  if (!user) return;
  const lang = getLang();
  const t = translations[lang];
  const errorEl = document.getElementById("formError");
  errorEl.classList.remove("show");

  const category = document.getElementById("fCategory").value;
  const city = document.getElementById("fCity").value;
  const contact = document.getElementById("fContact").value.trim();
  const title = document.getElementById("fTitle").value.trim();
  const desc = document.getElementById("fDesc").value.trim();
  const isTreasureCategory = category === "treasure";

  if (!category || !city || (!isTreasureCategory && !contact) || !title || !desc){
    errorEl.textContent = t.errorFillAll;
    errorEl.classList.add("show");
    return;
  }
  if (!editingId){
    if (isTreasureCategory){
      selectedPlan = "free"; // 私藏推荐分类：提交这一刻强制锁定为免费，不管中间状态对不对
    } else {
      if (!selectedPlan){
        errorEl.textContent = t.errorFillAll;
        errorEl.classList.add("show");
        return;
      }
      if ((selectedPlan === "10" || selectedPlan === "30") && !paymentScreenshotFile){
        errorEl.textContent = t.uploadPaymentScreenshot;
        errorEl.classList.add("show");
        return;
      }
    }
  }

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;

  const fd = new FormData();
  fd.append("category", category);
  fd.append("city", city);
  fd.append("contact", contact);
  fd.append("title", title);
  fd.append("desc", desc);
  newFiles.forEach(file => fd.append("photos", file));

  try{
    if (editingId){
      fd.append("keepPhotos", JSON.stringify(existingPhotos));
      await updateListing(editingId, fd);
      showToast(t.toastUpdated);
    } else {
      fd.append("plan", selectedPlan);
      if (paymentScreenshotFile) fd.append("paymentScreenshot", paymentScreenshotFile);
      await createListing(fd);
      showToast(t.toastPosted);
    }
    setTimeout(()=>{ location.href = "profile.html"; }, 500);
  }catch(err){
    errorEl.textContent = err.message;
    errorEl.classList.add("show");
    submitBtn.disabled = false;
    if (err.message && err.message.includes("登录已过期")){
      setTimeout(()=>{ location.href = "login.html?redirect=post.html"; }, 1800);
    }
  }
});

function initPage(){
  const lang = getLang();
  populateSelects(lang);
  const id = getQueryParam("id");
  if (id){
    loadListingForEdit(id, lang);
  } else {
    renderPlanOptions(lang);
    updateTreasureFreeMode();
  }
}

const user = requireAuth("post.html");
if (user){
  initLangSwitcher((newLang)=>{
    renderAuthArea();
    const prevCategory = document.getElementById("fCategory").value;
    populateSelects(newLang);
    document.getElementById("fCategory").value = prevCategory; // 切换语言不应该把用户已经选好的分类重置掉
    if (!editingId){
      renderPlanOptions(newLang);
      updateTreasureFreeMode(); // 重新检查一次，避免"分类还是私藏推荐、但付费框没跟着隐藏"这种不一致
    }
  });
  renderAuthArea();
  initPage();
}
