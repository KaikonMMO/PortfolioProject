// Mobile menu toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// Back to top button
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ==================== Portfolio Logic ====================

const gallery = document.getElementById("gallery");
const tagFilter = document.getElementById("tagFilter");
const dateFilter = document.getElementById("dateFilter");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDesc = document.getElementById("lightbox-description");
const lightboxTags = document.getElementById("lightbox-tags");
const lightboxYear = document.getElementById("lightbox-year");
const closeLightbox = document.querySelector(".lightbox .close");

let artworksData = [];

function renderGallery(data) {
  if (!gallery) return;
  gallery.innerHTML = "";

  data.forEach(art => {
    const item = document.createElement("div");
    item.className = `artwork ${art.format}`;
    item.innerHTML = `
      <div class="art-thumb" style="background-image: url('${art.thumb}')">
        <div class="overlay">
          <h3>${art.title}</h3>
          <p>${art.tags.join(", ")}</p>
        </div>
      </div>
    `;
    item.addEventListener("click", () => openLightbox(art));
    gallery.appendChild(item);
  });
  if (typeof Masonry === "function") new Masonry(gallery, { itemSelector: ".artwork", gutter: 5 });
}

function openLightbox(art) {
  if (!lightbox) return;
  lightbox.classList.remove("hidden");
  lightboxImg.src = art.image;
  lightboxTitle.textContent = art.title;
  lightboxDesc.textContent = art.description;
  lightboxTags.textContent = art.tags.join(", ");
  lightboxYear.textContent = new Date(art.date).toLocaleDateString();
}

if (closeLightbox) {
  closeLightbox.addEventListener("click", () => lightbox.classList.add("hidden"));
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) lightbox.classList.add("hidden");
  });
}

function populateTags(data) {
  const tagsSet = new Set();
  data.forEach(art => art.tags.forEach(tag => tagsSet.add(tag)));
  if (!tagFilter) return;
  tagsSet.forEach(tag => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagFilter.appendChild(option);
  });
}

function applyFilters() {
  let filtered = [...artworksData];

  const tag = tagFilter?.value;
  if (tag && tag !== "all") {
    filtered = filtered.filter(art => art.tags.includes(tag));
  }

  const order = dateFilter?.value;
  if (order === "asc") {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  renderGallery(filtered);
}

function fetchArtworks() {
  fetch("artworks.json")
    .then(res => res.json())
    .then(data => {
      artworksData = data.artworks;
      populateTags(artworksData);
      applyFilters();
    })
    .catch(err => console.error("Erro ao carregar artworks.json", err));
}

if (gallery) {
  fetchArtworks();
  tagFilter?.addEventListener("change", applyFilters);
  dateFilter?.addEventListener("change", applyFilters);
}
