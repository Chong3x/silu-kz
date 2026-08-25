/* ========== 我的发布页逻辑(需要登录) ========== */
async function renderMyListings(lang){
  const t = translations[lang];
  const grid = document.getElementById("myGrid");
  grid.innerHTML = `<p style="color:var(--muted)">…</p>`;
  try{
    const [listings, favIds] = await Promise.all([
      fetchListings({ mine:true }),
      fetchFavoriteIds()
    ]);
    if (listings.length === 0){
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <p>${t.noMyListings}</p>
        <a href="post.html">${t.navPost}</a>
      </div>`;
      return;
    }
    grid.innerHTML = listings.map(l => renderListingCard(l, lang, { showFavorite:true, showOwnerActions:true, favoriteIds: favIds })).join("");
  }catch(e){
    grid.innerHTML = `<p style="color:var(--danger)">${e.message}</p>`;
  }
}

async function renderPage(){
  if (!getCurrentUser()) return; // requireAuth 已经处理跳转
  const lang = getLang();
  await renderMyListings(lang);
  renderDaysLegend(lang);
}

const currentUser = requireAuth("profile.html");
if (currentUser){
  wireCardEvents(document.getElementById("myGrid"), ()=> renderPage());
  markActiveNav("profile");
  initLangSwitcher(()=>{ renderAuthArea(); renderPage(); });
  renderAuthArea();
  renderPage();
}
