/* ========== 首页逻辑 ========== */
let activeCategory = null;
let searchQuery = "";
let allListings = [];
let favoriteIds = [];

function renderCategoryGrid(lang){
  const t = translations[lang];
  const grid = document.getElementById("catGrid");
  grid.innerHTML = categories.map(c=>{
    const count = allListings.filter(l=>l.category===c.id).length;
    const freeHint = c.id === "treasure" ? `<span class="cat-free-hint">${t.treasureFreeNotice}</span>` : "";
    return `<button class="cat-card ${activeCategory===c.id ? 'active':''}" data-cat="${c.id}">
      <span class="cat-icon cat-icon-${c.color}">${c.icon}</span>
      <span class="cat-text">
        <span class="cat-name">${c.name[lang]}</span>
        <span class="cat-count">${count} ${t.statListings}</span>
        ${freeHint}
      </span>
    </button>`;
  }).join("");
  grid.querySelectorAll(".cat-card").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const cat = btn.getAttribute("data-cat");
      activeCategory = (activeCategory === cat) ? null : cat;
      renderView(lang);
      document.getElementById("listingsTitle").scrollIntoView({behavior:"smooth", block:"start"});
    });
  });
}

function renderListings(lang){
  const t = translations[lang];
  const grid = document.getElementById("listingGrid");
  const clearBtn = document.getElementById("clearFilter");
  const titleEl = document.getElementById("listingsTitle");

  clearBtn.hidden = !activeCategory;
  if (activeCategory){
    const cat = categories.find(c=>c.id===activeCategory);
    titleEl.textContent = cat.name[lang];
  } else {
    titleEl.textContent = t.allListings;
  }

  const q = searchQuery.trim().toLowerCase();
  const filtered = allListings.filter(l=>{
    const matchesCat = !activeCategory || l.category === activeCategory;
    const matchesQuery = !q ||
      (l.title||"").toLowerCase().includes(q) ||
      (l.desc||"").toLowerCase().includes(q) ||
      (cities[l.city] ? cities[l.city][lang] : "").toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  if (filtered.length === 0){
    grid.innerHTML = `<p style="color:var(--muted)">${t.noResults}</p>`;
    return;
  }
  grid.innerHTML = filtered.map(l => renderListingCard(l, lang, { showFavorite:true, favoriteIds })).join("");
}

function renderStats(){
  document.getElementById("statListings").textContent = allListings.length;
  document.getElementById("statCities").textContent = Object.keys(cities).length;
  document.getElementById("statCats").textContent = categories.length;
}

async function loadData(){
  const grid = document.getElementById("listingGrid");
  grid.innerHTML = `<p style="color:var(--muted)">…</p>`;
  try{
    const [listings, favIds] = await Promise.all([
      fetchListings({}),
      fetchFavoriteIds()
    ]);
    allListings = listings;
    favoriteIds = favIds;
  }catch(e){
    grid.innerHTML = `<p style="color:var(--danger)">${e.message}</p>`;
    allListings = [];
    favoriteIds = [];
  }
}

async function renderView(lang){
  renderCategoryGrid(lang);
  renderListings(lang);
  renderStats();
  renderDaysLegend(lang);
}

async function renderPage(){
  const lang = getLang();
  await loadData();
  await renderView(lang);
}

document.getElementById("searchForm").addEventListener("submit", e=>{
  e.preventDefault();
  searchQuery = document.getElementById("searchInput").value;
  renderListings(getLang());
});

document.getElementById("clearFilter").addEventListener("click", ()=>{
  activeCategory = null;
  renderView(getLang());
});

wireCardEvents(document.getElementById("listingGrid"), async ()=>{
  favoriteIds = await fetchFavoriteIds();
  renderListings(getLang());
});

markActiveNav("home");
initLangSwitcher((newLang)=>{ renderAuthArea(); renderView(newLang); });
renderAuthArea();
renderPage();
