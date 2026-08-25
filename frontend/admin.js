/* ========== 管理后台逻辑 ========== */
let currentTab = "payments";

function catName(id, lang){ const c = categoryOf(id); return c ? c.name[lang] : id; }
function cityName(id, lang){ return cities[id] ? cities[id][lang] : id; }

async function renderPaymentsTab(lang){
  const t = translations[lang];
  const wrap = document.getElementById("adminContent");
  wrap.innerHTML = `<p style="color:var(--muted)">…</p>`;
  const list = await fetchAdminQueue("pending_payment");
  if (list.length === 0){ wrap.innerHTML = `<p style="color:var(--muted)">${t.adminNoData}</p>`; return; }

  wrap.innerHTML = list.map(l => `
    <div class="admin-card" data-id="${l.id}">
      <div class="admin-card-head">
        <div>
          <h4>${l.title}</h4>
          <div class="meta">${catName(l.category, lang)} · ${cityName(l.city, lang)} · ${l.contact}</div>
          <div class="meta">${l.user ? l.user.name : ""} (${l.user ? (l.user.phone || l.user.email || "") : ""})</div>
          ${l.ipAddress ? `<div class="meta">${t.ipLabel}: ${l.ipAddress}</div>` : ""}
        </div>
        <div class="meta">${l.planDays} ${lang==='zh'?'天':'days'} · ${l.paymentAmount} KZT</div>
      </div>
      ${l.paymentScreenshotUrl ? `<div class="admin-thumb-row"><img class="admin-thumb" src="${API_ORIGIN}${l.paymentScreenshotUrl}" alt="" onclick="window.open('${API_ORIGIN}${l.paymentScreenshotUrl}','_blank')"></div>` : ""}
      <div class="admin-actions">
        <button class="btn btn-primary btn-sm" data-confirm-pay="${l.id}">${t.adminConfirmPay}</button>
        <input type="text" placeholder="${t.adminRejectReasonPh}" data-reason-input="${l.id}">
        <button class="btn btn-ghost btn-sm" data-reject="${l.id}">${t.adminReject}</button>
      </div>
    </div>`).join("");

  wrap.querySelectorAll("[data-confirm-pay]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      btn.disabled = true;
      try{ await confirmListingPayment(btn.getAttribute("data-confirm-pay")); showToast("OK"); renderAdminStats(lang); renderPaymentsTab(lang); }
      catch(e){ alert(e.message); btn.disabled = false; }
    });
  });
  wireRejectButtons(wrap, ()=> renderPaymentsTab(lang));
}

async function renderListingsTab(lang, reviewType){
  const t = translations[lang];
  const wrap = document.getElementById("adminContent");
  wrap.innerHTML = `<p style="color:var(--muted)">…</p>`;
  const list = await fetchAdminQueue("pending", reviewType);
  if (list.length === 0){ wrap.innerHTML = `<p style="color:var(--muted)">${t.adminNoData}</p>`; return; }

  wrap.innerHTML = list.map(l => `
    <div class="admin-card" data-id="${l.id}">
      <div class="admin-card-head">
        <div>
          <h4>${l.title}</h4>
          <div class="meta">${catName(l.category, lang)} · ${cityName(l.city, lang)} · ${l.contact}</div>
          <div class="meta">${l.user ? l.user.name : ""} (${l.user ? (l.user.phone || l.user.email || "") : ""})</div>
          ${l.ipAddress ? `<div class="meta">${t.ipLabel}: ${l.ipAddress}</div>` : ""}
        </div>
        <div class="meta">${l.planDays ? l.planDays + (lang==='zh'?' 天(付费)':' days(paid)') : (lang==='zh'?'免费':'free')}</div>
      </div>
      <p style="font-size:.85rem;color:var(--muted);margin:8px 0;">${l.desc}</p>
      ${l.photos.length ? `<div class="admin-thumb-row">${l.photos.map(p=>`<img class="admin-thumb" src="${API_ORIGIN}${p}" alt="" onclick="window.open('${API_ORIGIN}${p}','_blank')">`).join("")}</div>` : ""}
      <div class="admin-actions">
        <button class="btn btn-primary btn-sm" data-approve="${l.id}">${t.adminApprove}</button>
        <input type="text" placeholder="${t.adminRejectReasonPh}" data-reason-input="${l.id}">
        <button class="btn btn-ghost btn-sm" data-reject="${l.id}">${t.adminReject}</button>
      </div>
    </div>`).join("");

  wrap.querySelectorAll("[data-approve]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      btn.disabled = true;
      try{ await approveListing(btn.getAttribute("data-approve")); showToast("OK"); renderAdminStats(lang); renderListingsTab(lang, reviewType); }
      catch(e){ alert(e.message); btn.disabled = false; }
    });
  });
  wireRejectButtons(wrap, ()=> renderListingsTab(lang, reviewType));
}

function wireRejectButtons(wrap, onDone){
  wrap.querySelectorAll("[data-reject]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const id = btn.getAttribute("data-reject");
      const reasonInput = wrap.querySelector(`[data-reason-input="${id}"]`);
      const reason = reasonInput ? reasonInput.value.trim() : "";
      btn.disabled = true;
      try{ await rejectListing(id, reason); showToast("OK"); renderAdminStats(getLang()); onDone(); }
      catch(e){ alert(e.message); btn.disabled = false; }
    });
  });
}

async function renderFeedbackTab(lang){
  const t = translations[lang];
  const wrap = document.getElementById("adminContent");
  wrap.innerHTML = `<p style="color:var(--muted)">…</p>`;
  const list = await fetchFeedbackAdmin();
  if (list.length === 0){ wrap.innerHTML = `<p style="color:var(--muted)">${t.adminNoData}</p>`; return; }

  const typeLabel = { bug:t.feedbackTypeBug, suggestion:t.feedbackTypeSuggestion, complaint:t.feedbackTypeComplaint, other:t.feedbackTypeOther };
  const statusLabel = { pending:t.statusPending, read:"👁", resolved:"✅" };

  wrap.innerHTML = list.map(f => `
    <div class="admin-card" data-id="${f.id}">
      <div class="admin-card-head">
        <div>
          <h4>${typeLabel[f.type] || f.type} <span class="status-badge status-pending">${f.status}</span></h4>
          <div class="meta">${f.contact || ""} · ${formatDate(f.created_at, lang)}</div>
        </div>
      </div>
      <p style="font-size:.85rem;margin:8px 0;">${f.content}</p>
      <div class="admin-actions">
        <button class="btn btn-ghost btn-sm" data-status="${f.id}|read">${t.adminMarkRead}</button>
        <button class="btn btn-primary btn-sm" data-status="${f.id}|resolved">${t.adminMarkResolved}</button>
      </div>
    </div>`).join("");

  wrap.querySelectorAll("[data-status]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const [id, status] = btn.getAttribute("data-status").split("|");
      btn.disabled = true;
      try{ await updateFeedbackStatus(id, status); showToast("OK"); renderAdminStats(lang); renderFeedbackTab(lang); }
      catch(e){ alert(e.message); btn.disabled = false; }
    });
  });
}

async function renderReferralsTab(lang){
  const t = translations[lang];
  const wrap = document.getElementById("adminContent");
  wrap.innerHTML = `<p style="color:var(--muted)">…</p>`;
  const list = await fetchReferralsAdmin("pending");
  if (list.length === 0){ wrap.innerHTML = `<p style="color:var(--muted)">${t.adminNoData}</p>`; return; }

  wrap.innerHTML = list.map(r => `
    <div class="admin-card" data-id="${r.id}">
      <div class="admin-card-head">
        <div>
          <h4>${r.user ? r.user.name : ""}</h4>
          <div class="meta">${r.user ? (r.user.phone || r.user.email || "") : ""} · ${formatDate(r.created_at, lang)}</div>
        </div>
      </div>
      ${r.screenshot_url ? `<div class="admin-thumb-row"><img class="admin-thumb" src="${API_ORIGIN}${r.screenshot_url}" alt="" onclick="window.open('${API_ORIGIN}${r.screenshot_url}','_blank')"></div>` : ""}
      <div class="admin-actions">
        <button class="btn btn-primary btn-sm" data-ref-approve="${r.id}">${t.adminApprove}</button>
        <button class="btn btn-ghost btn-sm" data-ref-reject="${r.id}">${t.adminReject}</button>
      </div>
    </div>`).join("");

  wrap.querySelectorAll("[data-ref-approve]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      btn.disabled = true;
      try{ await approveReferral(btn.getAttribute("data-ref-approve")); showToast("OK"); renderAdminStats(lang); renderReferralsTab(lang); }
      catch(e){ alert(e.message); btn.disabled = false; }
    });
  });
  wrap.querySelectorAll("[data-ref-reject]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      btn.disabled = true;
      try{ await rejectReferral(btn.getAttribute("data-ref-reject")); showToast("OK"); renderAdminStats(lang); renderReferralsTab(lang); }
      catch(e){ alert(e.message); btn.disabled = false; }
    });
  });
}

async function renderActiveTab(lang){
  const t = translations[lang];
  const wrap = document.getElementById("adminContent");
  wrap.innerHTML = `<p style="color:var(--muted)">…</p>`;
  const [activeList, hiddenList] = await Promise.all([
    fetchAdminQueue("active"),
    fetchAdminQueue("hidden")
  ]);
  const list = activeList.concat(hiddenList);
  if (list.length === 0){ wrap.innerHTML = `<p style="color:var(--muted)">${t.adminNoData}</p>`; return; }

  wrap.innerHTML = list.map(l => `
    <div class="admin-card" data-id="${l.id}">
      <div class="admin-card-head">
        <div>
          <h4>${l.title} ${statusBadge(l, lang)}</h4>
          <div class="meta">${catName(l.category, lang)} · ${cityName(l.city, lang)} · ${l.contact}</div>
          <div class="meta">${l.user ? l.user.name : ""} (${l.user ? (l.user.phone || l.user.email || "") : ""})</div>
          ${l.ipAddress ? `<div class="meta">${t.ipLabel}: ${l.ipAddress}</div>` : ""}
        </div>
        <div class="meta" style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
          <span class="admin-plan-badge ${l.planDays ? 'paid' : 'free'}">
            ${l.planDays ? `${t.adminPaidBadge} · ${l.planDays}${lang==='zh'?'天':'d'}` : t.adminFreeBadge}
          </span>
          ${l.daysLeft !== null && l.daysLeft !== undefined ? `<span>${t.daysLeftLabel.replace("{n}", l.daysLeft)}</span>` : ""}
        </div>
      </div>
      ${l.photos.length ? `<div class="admin-thumb-row">${l.photos.map(p=>`<img class="admin-thumb" src="${API_ORIGIN}${p}" alt="" onclick="window.open('${API_ORIGIN}${p}','_blank')">`).join("")}</div>` : ""}
      <div class="admin-actions">
        ${l.status === "active"
          ? `<button class="btn btn-ghost btn-sm" data-hide="${l.id}">${t.adminHide}</button>`
          : `<button class="btn btn-primary btn-sm" data-unhide="${l.id}">${t.adminUnhide}</button>`}
        <button class="btn btn-ghost btn-sm" data-admin-delete="${l.id}">${t.adminDelete}</button>
      </div>
    </div>`).join("");

  wrap.querySelectorAll("[data-hide]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      if (!confirm(t.confirmHideListing)) return;
      btn.disabled = true;
      try{ await hideListing(btn.getAttribute("data-hide")); showToast("OK"); renderAdminStats(lang); renderActiveTab(lang); }
      catch(e){ alert(e.message); btn.disabled = false; }
    });
  });
  wrap.querySelectorAll("[data-unhide]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      if (!confirm(t.confirmUnhideListing)) return;
      btn.disabled = true;
      try{ await unhideListing(btn.getAttribute("data-unhide")); showToast("OK"); renderAdminStats(lang); renderActiveTab(lang); }
      catch(e){ alert(e.message); btn.disabled = false; }
    });
  });
  wrap.querySelectorAll("[data-admin-delete]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      if (!confirm(t.confirmAdminDelete)) return;
      btn.disabled = true;
      try{ await adminDeleteListing(btn.getAttribute("data-admin-delete")); showToast("OK"); renderAdminStats(lang); renderActiveTab(lang); }
      catch(e){ alert(e.message); btn.disabled = false; }
    });
  });
}

const tabRenderers = {
  payments: (lang)=> renderPaymentsTab(lang),
  listings: (lang)=> renderListingsTab(lang, "new"),
  edited: (lang)=> renderListingsTab(lang, "edited"),
  active: (lang)=> renderActiveTab(lang),
  feedback: (lang)=> renderFeedbackTab(lang),
  referrals: (lang)=> renderReferralsTab(lang)
};

function switchTab(tab){
  currentTab = tab;
  document.querySelectorAll(".admin-tab").forEach(b=> b.classList.toggle("active", b.getAttribute("data-tab")===tab));
  tabRenderers[tab](getLang());
}

async function renderAdminStats(lang){
  const t = translations[lang];
  const wrap = document.getElementById("adminStats");
  if (!wrap) return;
  try{
    const stats = await fetchAdminStats();

    const cards = [
      { label: t.adminTotalUsers, num: stats.totalUsers },
      { label: t.adminTotalAdmins, num: stats.totalAdmins }
    ];
    wrap.innerHTML = cards.map(c => `
      <div class="admin-stat-card">
        <p class="admin-stat-label">${c.label}</p>
        <p class="admin-stat-num">${c.num}</p>
      </div>`).join("");

    /* 同步更新标签栏按钮上的小角标数字，0的话就隐藏不显示 */
    const badgeMap = {
      payments: stats.pendingPayment,
      listings: stats.newListings,
      edited: stats.editedListings,
      feedback: stats.pendingFeedback,
      referrals: stats.pendingReferrals
    };
    Object.keys(badgeMap).forEach(key=>{
      const badge = document.getElementById("tabBadge-" + key);
      if (!badge) return;
      const count = badgeMap[key];
      badge.hidden = count === 0;
      badge.textContent = count;
    });
  }catch(e){ /* 统计加载失败不影响其它功能，静默跳过 */ }
}

document.querySelectorAll(".admin-tab").forEach(btn=>{
  btn.addEventListener("click", ()=> switchTab(btn.getAttribute("data-tab")));
});

const user = requireAuth("admin.html");
if (user){
  if (user.role !== "admin"){
    location.href = "index.html";
  } else {
    initLangSwitcher((newLang)=>{ renderAuthArea(); renderAdminStats(newLang); switchTab(currentTab); });
    renderAuthArea();
    renderAdminStats(getLang());
    switchTab(currentTab);
  }
}
