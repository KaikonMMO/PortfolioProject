// ========== Mobile Menu Toggle ==========
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger?.addEventListener("click", () => {
  navLinks?.classList.toggle("active");
});

// ========== Back to Top Button ==========
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    window.requestAnimationFrame(() => {
      backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ========== Portfolio Logic ==========
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

// ========== Render Gallery ==========
function renderGallery(data) {
  if (!gallery) return;

  const fragment = document.createDocumentFragment();
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
    fragment.appendChild(item);
  });

  gallery.appendChild(fragment);

  // Inicializa Masonry se disponível
  typeof Masonry === "function" && new Masonry(gallery, {
    itemSelector: ".artwork",
    gutter: 5
  });
}

// ========== Lightbox ==========
function openLightbox(art) {
  if (!lightbox) return;

  lightbox.classList.remove("hidden");
  lightboxImg.src = art.image;
  lightboxImg.loading = "lazy";
  lightboxTitle.textContent = art.title;
  lightboxDesc.textContent = art.description;
  lightboxTags.textContent = art.tags.join(", ");
  lightboxYear.textContent = new Date(art.date).toLocaleDateString();
}

closeLightbox?.addEventListener("click", () => {
  lightbox?.classList.add("hidden");
});

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.classList.add("hidden");
});

// ========== Populate Tags ==========
function populateTags(data) {
  if (!tagFilter) return;

  const tagsSet = new Set();
  data.forEach(art => art.tags.forEach(tag => tagsSet.add(tag)));

  tagsSet.forEach(tag => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagFilter.appendChild(option);
  });
}

// ========== Apply Filters ==========
function applyFilters() {
  if (!tagFilter || !dateFilter) return;

  let filtered = [...artworksData];

  const tag = tagFilter.value;
  if (tag !== "all") {
    filtered = filtered.filter(art => art.tags.includes(tag));
  }

  const order = dateFilter.value;
  filtered.sort((a, b) =>
    order === "asc"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date)
  );

  renderGallery(filtered);
}

// ========== Fetch JSON ==========
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

// ========== Inicialização ==========
if (gallery) {
  fetchArtworks();
  tagFilter?.addEventListener("change", applyFilters);
  dateFilter?.addEventListener("change", applyFilters);
}
