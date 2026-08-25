/* ========== 收藏页逻辑 ========== */
async function renderFavorites(lang){
  const t = translations[lang];
  const grid = document.getElementById("favGrid");

  if (!getCurrentUser()){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <p>${t.loginRequiredMsg}</p>
      <a href="login.html?redirect=favorites.html">${t.goLogin}</a>
    </div>`;
    return;
  }

  grid.innerHTML = `<p style="color:var(--muted)">…</p>`;
  try{
    const favIds = await fetchFavoriteIds();
    if (favIds.length === 0){
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <p>${t.noFavorites}</p>
        <a href="index.html">${t.backHome}</a>
      </div>`;
      return;
    }
    const all = await fetchListings({});
    const listings = all.filter(l => favIds.includes(l.id));
    grid.innerHTML = listings.map(l => renderListingCard(l, lang, { showFavorite:true, favoriteIds: favIds })).join("");
  }catch(e){
    grid.innerHTML = `<p style="color:var(--danger)">${e.message}</p>`;
  }
}

async function renderPage(){
  const lang = getLang();
  await renderFavorites(lang);
  renderDaysLegend(lang);
}

wireCardEvents(document.getElementById("favGrid"), ()=> renderPage());

markActiveNav("favorites");
initLangSwitcher(()=>{ renderAuthArea(); renderPage(); });
renderAuthArea();
renderPage();
