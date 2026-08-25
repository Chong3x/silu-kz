/* ========== 广告详情页逻辑 ========== */
let currentPhotoIndex = 0;
let currentListing = null;

function getQueryParam(name){
  return new URLSearchParams(location.search).get(name);
}

function renderGallery(listing, lang){
  const photos = listing.photos || [];
  if (photos.length === 0){
    const cat = categoryOf(listing.category);
    return `<div class="detail-photo detail-photo--placeholder">${cat ? cat.icon : ""}</div>`;
  }
  const main = `
    <div class="detail-photo">
      <img id="detailMainPhoto" src="${API_ORIGIN}${photos[currentPhotoIndex]}" alt="">
      ${photos.length > 1 ? `<span class="photo-count" id="detailPhotoCounter">${translations[lang].photoCounter.replace("{cur}", currentPhotoIndex+1).replace("{total}", photos.length)}</span>` : ""}
    </div>`;
  const thumbs = photos.length > 1 ? `
    <div class="detail-thumb-row">
      ${photos.map((p,i)=>`<img class="detail-thumb ${i===currentPhotoIndex?'active':''}" data-idx="${i}" src="${API_ORIGIN}${p}" alt="">`).join("")}
    </div>` : "";
  return main + thumbs;
}

function wireGallery(listing, lang){
  document.querySelectorAll(".detail-thumb").forEach(thumb=>{
    thumb.addEventListener("click", ()=>{
      currentPhotoIndex = parseInt(thumb.getAttribute("data-idx"), 10);
      document.getElementById("detailMainPhoto").src = API_ORIGIN + listing.photos[currentPhotoIndex];
      const counter = document.getElementById("detailPhotoCounter");
      if (counter) counter.textContent = translations[lang].photoCounter.replace("{cur}", currentPhotoIndex+1).replace("{total}", listing.photos.length);
      document.querySelectorAll(".detail-thumb").forEach(t=> t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
}

async function loadListing(){
  const wrap = document.getElementById("detailContent");
  const id = getQueryParam("id");
  const lang = getLang();
  const t = translations[lang];
  if (!id){
    wrap.innerHTML = `<div class="empty-state"><p>${t.listingNotFound}</p><a href="index.html">${t.backHome}</a></div>`;
    return;
  }
  wrap.innerHTML = `<p style="color:var(--muted)">…</p>`;
  try{
    const [listing, favIds] = await Promise.all([
      fetchListing(id),
      fetchFavoriteIds()
    ]);
    currentListing = listing;
    currentPhotoIndex = 0;

    const cat = categoryOf(listing.category);
    const cityName = cities[listing.city] ? cities[listing.city][lang] : listing.city;
    const fav = favIds.includes(listing.id);
    const user = getCurrentUser();
    const isOwner = user && user.id === listing.userId;

    const badges = isOwner
      ? `<div class="badge-row">${statusBadge(listing, lang)}${daysLeftBadge(listing, lang)}</div>`
      : (daysLeftBadge(listing, lang) ? `<div class="badge-row">${daysLeftBadge(listing, lang)}</div>` : "");

    const reasonBox = isOwner ? rejectReasonBox(listing, lang) : "";

    const recommendRow = listing.category === "treasure" ? `
      <div class="recommend-row" style="margin-top:14px;">
        <button class="btn-mini ${listing.hasRecommended ? 'recommended' : ''}" data-recommend-id="${listing.id}" ${listing.hasRecommended ? 'disabled' : ''}>
          ${listing.hasRecommended ? t.recommendedBtn : t.recommendBtn}
        </button>
        <span class="recommend-count" data-recommend-count>${t.recommendCountLabel.replace("{n}", listing.recommendCount || 0)}</span>
      </div>` : "";

    const ownerActions = isOwner ? `
      <div class="owner-actions" style="margin-top:16px;">
        <a class="btn-mini" href="post.html?id=${listing.id}">${t.editBtn}</a>
        <button class="btn-mini btn-mini-danger" data-delete-id="${listing.id}">${iconTrash()} ${t.deleteBtn}</button>
      </div>` : "";

    wrap.innerHTML = `
      <div class="panel-card detail-card">
        <div class="detail-gallery">${renderGallery(listing, lang)}</div>
        <div class="detail-body">
          <div class="detail-top-row">
            <span class="listing-tag">${cat ? cat.name[lang] : ""}</span>
            <button class="fav-btn detail-fav-btn ${fav ? 'active':''}" data-fav-id="${listing.id}" aria-label="favorite">${iconHeart(fav)}</button>
          </div>
          <h1 class="detail-title">${listing.title}</h1>
          ${badges}
          ${reasonBox}
          <div class="detail-meta-row">
            <span>${cityName}</span>
            <span>${t.dateLabel} ${formatDate(listing.createdAt, lang)}</span>
          </div>
          <p class="detail-desc">${listing.desc}</p>
          ${listing.category !== "treasure" ? `
          <div class="detail-contact-box">
            <span class="detail-contact-label">${t.formContact}</span>
            <span class="detail-contact-value">${listing.contact}</span>
          </div>` : ""}
          ${recommendRow}
          ${ownerActions}
        </div>
      </div>`;

    wireGallery(listing, lang);
    wireCardEvents(wrap, ()=> loadListing());
  }catch(e){
    wrap.innerHTML = `<div class="empty-state"><p>${t.listingNotFound}</p><a href="index.html">${t.backHome}</a></div>`;
  }
}

initLangSwitcher(()=>{ renderAuthArea(); loadListing(); });
renderAuthArea();
loadListing();
