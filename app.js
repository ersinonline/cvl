const API_KEY = "";
const LLM_MODEL = "gemini-2.5-flash-preview-09-2025";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/" +
  LLM_MODEL +
  ":generateContent?key=" +
  API_KEY;

try {
  const cfg = {
    theme: {
      extend: {
        colors: {
          civil: {
            red: "#dd3612",
            dark: "#c22f0f",
            light: "#fff1f0",
            bg: "#f8fafc",
          },
        },
        fontFamily: { sans: ["Inter", "sans-serif"] },
      },
    },
  };

  if (typeof tailwind !== "undefined") {
    tailwind.config = cfg;
  } else {
    window.tailwind = { config: cfg };
  }
} catch (_) {}

const SECTION_META = [
  {
    id: "dashboard",
    title: "Ana Sayfa",
    url: "dashboard.html",
    description: "Genel görünüm, hızlı erişim ve eğitim başlangıcı.",
    keywords: ["ana sayfa", "dashboard", "başlangıç", "menü"],
  },
  {
    id: "raporlar",
    title: "Kasa Raporları",
    url: "raporlar.html",
    description: "Hareket özeti, kasiyer raporları ve mağaza görünümü.",
    keywords: ["rapor", "hareket özeti", "kasiyer", "günlük rapor"],
  },
  {
    id: "pos-islemleri",
    title: "POS İşlemleri",
    url: "pos-islemleri.html",
    description: "POS iptal, iade, gün sonu ve slip işlemleri.",
    keywords: ["pos", "iade", "iptal", "gün sonu", "slip", "qr"],
  },
  {
    id: "ozel-odemeler",
    title: "Hediye Kartları",
    url: "ozel-odemeler.html",
    description: "Hediye kartı, iWallet ve özel ödeme adımları.",
    keywords: ["hediye kartı", "iwallet", "setcard", "edenred", "özel ödeme"],
  },
  {
    id: "nakit-yatirma",
    title: "Nakit Yatırma",
    url: "nakit-yatirma.html",
    description: "Bankaya para yatırma ve fiş tipi kuralları.",
    keywords: ["nakit", "yatırma", "tediye", "tahsil", "banka"],
  },
  {
    id: "kasa-duzeltme",
    title: "Hatalı İşlemler",
    url: "kasa-duzeltme.html",
    description: "İşlem kayması, yanlış tahsilat ve düzeltme akışları.",
    keywords: ["kasa hatası", "işlem kayması", "düzeltme", "hatalı işlem"],
  },
  {
    id: "masraf-duzeltme",
    title: "Masraf Girişi",
    url: "masraf-duzeltme.html",
    description: "Masraf, fiyat farkı ve düzeltme girişleri.",
    keywords: ["masraf", "fiyat hatası", "gider", "düzeltme"],
  },
  {
    id: "fatura-portal",
    title: "eTicaret",
    url: "fatura-portal.html",
    description: "Portal, online alışveriş ve fatura işlemleri.",
    keywords: ["fatura", "portal", "online", "e-ticaret", "alışveriş"],
  },
  {
    id: "taksitler",
    title: "Taksitler",
    url: "taksitler.html",
    description: "Kart bazlı taksit kuralları ve vade farkı bilgileri.",
    keywords: ["taksit", "vade", "world", "albaraka", "kampanya"],
  },
  {
    id: "sablon",
    title: "Şablon",
    url: "sablon.html",
    description: "Hazır şablon ve kopyalanabilir örnek içerikler.",
    keywords: ["şablon", "örnek", "hazır metin"],
  },
  {
    id: "havale-eft",
    title: "Havale / EFT",
    url: "havale-eft.html",
    description: "Havale ve EFT işlemleri için temel akış.",
    keywords: ["havale", "eft", "transfer"],
  },
  {
    id: "chippin",
    title: "Chippin",
    url: "chippin.html",
    description: "Chippin ödeme alma ve kampanya kontrolü.",
    keywords: ["chippin", "mobile pay", "puan"],
  },
  {
    id: "gorus-oneri",
    title: "Görüş & Öneri",
    url: "gorus-oneri.html",
    description: "Geri bildirim ve geliştirme önerileri alanı.",
    keywords: ["öneri", "görüş", "geri bildirim"],
  },
  {
    id: "kasa-egitim",
    title: "Kasa Eğitim Modülü",
    url: "kasa-egitim.html",
    description: "İnteraktif modüller, sınav ve sertifika.",
    keywords: ["eğitim", "modül", "sınav", "sertifika", "yeni başlayan"],
  },
];

const SECTION_ROUTES = Object.fromEntries(
  SECTION_META.map((item) => [item.id, item.url])
);

const STORAGE_KEYS = {
  favorites: "civilFavorites",
  lastPage: "civilLastPage",
  lastTrainingModule: "civilLastTrainingModule",
  completedModules: "completedModules",
};

let deferredInstallPrompt = null;
let lastConnectivityState = navigator.onLine;

function isNativeCapacitorApp() {
  return window.location.protocol === "capacitor:" || document.URL.startsWith("capacitor://");
}

function isNativeIOSApp() {
  return isNativeCapacitorApp() && /iphone|ipad|ipod/i.test(navigator.userAgent || "");
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    const currentPage = (location.pathname.split("/").pop() || "").toLowerCase();
    if (!isNativeCapacitorApp() && (currentPage === "" || currentPage === "index.html")) {
      window.location.href = "dashboard.html";
      return;
    }
  } catch (_) {}

  if (isNativeIOSApp()) {
    document.body.classList.add("native-ios-app");
  }

  ensureGlobalShell();
  loadSharedFragments();
  initializePageState();
  bindGlobalEvents();
  registerServiceWorker();
  setupInstallPrompt();
  updateConnectivityState(true);

  if (window.lucide) {
    lucide.createIcons();
  }
});

function ensureGlobalShell() {
  ensureChatWidget();
  ensureImageModal();
  ensureCommandPalette();
}

function loadSharedFragments() {
  const sidebarMount = document.getElementById("sidebarMount");
  if (sidebarMount) {
    fetch("sidebar.html")
      .then((response) => response.text())
      .then((html) => {
        sidebarMount.innerHTML = html;
        refreshSidebarState();
      })
      .catch(() => {});
  }

  const headerMount = document.getElementById("headerMount");
  if (headerMount) {
    fetch("header.html")
      .then((response) => response.text())
      .then((html) => {
        headerMount.innerHTML = html;
        refreshHeaderState();
      })
      .catch(() => {});
  }
}

function initializePageState() {
  highlightCurrentRoute();
  rememberCurrentPage();
  renderDashboardEnhancements();

  const hash = window.location.hash.replace("#", "");
  const targetEl = hash ? document.getElementById(hash) : null;
  if (hash && !targetEl) {
    const url = SECTION_ROUTES[hash];
    if (url) {
      window.location.href = url;
      return;
    }
  }

  const defaultSection =
    (targetEl && targetEl.id) ||
    (document.getElementById("dashboard")
      ? "dashboard"
      : document.querySelector(".content-section")?.id || null);

  if (defaultSection) {
    showSection(defaultSection);
  }
}

function bindGlobalEvents() {
  document.addEventListener("keydown", (event) => {
    const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
    if (isShortcut) {
      event.preventDefault();
      openCommandPalette();
      return;
    }

    if (event.key === "Escape") {
      closeCommandPalette();
      closeModal();
    }
  });

  window.addEventListener("online", () => updateConnectivityState(false));
  window.addEventListener("offline", () => updateConnectivityState(false));
}

function ensureChatWidget() {
  if (document.getElementById("chatWidget")) {
    return;
  }

  fetch("chat.html")
    .then((response) => response.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);
      bindChatForm();
      if (window.lucide) {
        lucide.createIcons();
      }
    })
    .catch(() => {});
}

function ensureImageModal() {
  if (document.getElementById("imageModal")) {
    return;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div id="imageModal" class="fixed inset-0 bg-black/90 z-50 hidden flex items-center justify-center p-4 image-modal" onclick="closeModal()">
        <img id="modalImage" src="" class="max-w-full max-h-[90vh] rounded-lg shadow-2xl transform transition-transform scale-95">
        <button class="absolute top-5 right-5 text-white p-2 hover:bg-white/20 rounded-full transition-colors" aria-label="Kapat">
          <i data-lucide="x" class="w-8 h-8"></i>
        </button>
      </div>
    `
  );

  if (window.lucide) {
    lucide.createIcons();
  }
}

function ensureCommandPalette() {
  if (document.getElementById("commandPalette")) {
    return;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div id="commandPalette" class="command-palette-overlay hidden">
        <div class="command-palette-panel">
          <div class="command-palette-head">
            <div class="flex items-center gap-3">
              <i data-lucide="search" class="w-5 h-5 text-civil-red"></i>
              <input
                id="commandPaletteInput"
                type="text"
                placeholder="İşlem, konu, kural veya sayfa adı yazın..."
                class="command-palette-input"
              >
            </div>
            <button type="button" onclick="closeCommandPalette()" class="command-palette-close" aria-label="Kapat">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
          <div id="commandPaletteHint" class="command-palette-hint">
            En hızlı kullanım: "iade", "z raporu", "chippin", "nakit yatırma", "sertifika"
          </div>
          <div id="commandPaletteResults" class="command-palette-results"></div>
        </div>
      </div>
      <div id="appStatusToast" class="app-status-toast hidden"></div>
      <button
        id="floatingInstallButton"
        type="button"
        onclick="triggerInstallPrompt()"
        class="floating-install-button hidden"
      >
        <i data-lucide="download" class="w-4 h-4"></i>
        Uygulamayı Yükle
      </button>
    `
  );

  const overlay = document.getElementById("commandPalette");
  const input = document.getElementById("commandPaletteInput");

  if (overlay) {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeCommandPalette();
      }
    });
  }

  if (input) {
    input.addEventListener("input", (event) => {
      renderCommandPaletteResults(event.target.value);
    });
  }

  renderCommandPaletteResults("");

  if (window.lucide) {
    lucide.createIcons();
  }
}

function refreshSidebarState() {
  highlightCurrentRoute();
  decorateSidebarFavorites();
  renderSidebarFavorites();

  if (window.lucide) {
    lucide.createIcons();
  }
}

function refreshHeaderState() {
  updateInstallUI();

  if (window.lucide) {
    lucide.createIcons();
  }
}

function bindChatForm() {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("llmInput");

  if (form) {
    form.addEventListener("submit", handleChatRequest);
  }

  if (input) {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (form) {
          form.dispatchEvent(new Event("submit", { cancelable: true }));
        }
      }
    });
  }
}

function highlightCurrentRoute() {
  const current = getCurrentPageName();
  document.querySelectorAll("#sidebar .nav-item").forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (href && current && href.endsWith(current)) {
      link.classList.add("bg-civil-light", "text-civil-red");
      link.classList.remove("text-slate-600");
    } else {
      link.classList.remove("bg-civil-light", "text-civil-red");
      link.classList.add("text-slate-600");
    }
  });
}

function getCurrentPageName() {
  return (location.pathname.split("/").pop() || "").toLowerCase();
}

function getCurrentSectionMeta() {
  const currentPage = getCurrentPageName();
  return SECTION_META.find((item) => item.url.toLowerCase() === currentPage) || null;
}

function rememberCurrentPage() {
  const currentMeta = getCurrentSectionMeta();
  if (currentMeta && currentMeta.id !== "dashboard") {
    localStorage.setItem(STORAGE_KEYS.lastPage, currentMeta.id);
  }
}

function getFavorites() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch (_) {
    return [];
  }
}

function setFavorites(nextFavorites) {
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(nextFavorites));
}

function isFavorite(sectionId) {
  return getFavorites().includes(sectionId);
}

function toggleFavorite(sectionId) {
  const favorites = getFavorites();
  const nextFavorites = favorites.includes(sectionId)
    ? favorites.filter((item) => item !== sectionId)
    : [...favorites, sectionId];

  setFavorites(nextFavorites);
  decorateSidebarFavorites();
  renderSidebarFavorites();
  renderDashboardEnhancements();
}

function decorateSidebarFavorites() {
  document.querySelectorAll("#sidebar .nav-item").forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    const meta = SECTION_META.find((item) => item.url.toLowerCase() === href);
    if (!meta || link.querySelector(".favorite-toggle")) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "favorite-toggle ml-auto text-slate-300 hover:text-amber-500 transition-colors";
    button.setAttribute("aria-label", `${meta.title} favorilere ekle`);
    button.innerHTML = `<i data-lucide="star" class="w-4 h-4 ${isFavorite(meta.id) ? "fill-current text-amber-500" : ""}"></i>`;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleFavorite(meta.id);
    });

    link.appendChild(button);
  });

  document.querySelectorAll(".favorite-toggle").forEach((button) => {
    const link = button.closest(".nav-item");
    const href = (link?.getAttribute("href") || "").toLowerCase();
    const meta = SECTION_META.find((item) => item.url.toLowerCase() === href);
    if (!meta) {
      return;
    }

    button.innerHTML = `<i data-lucide="star" class="w-4 h-4 ${isFavorite(meta.id) ? "fill-current text-amber-500" : ""}"></i>`;
  });
}

function renderSidebarFavorites() {
  const wrapper = document.getElementById("sidebarFavoritesSection");
  const list = document.getElementById("sidebarFavoritesList");
  if (!wrapper || !list) {
    return;
  }

  const favorites = getFavorites()
    .map((id) => SECTION_META.find((item) => item.id === id))
    .filter(Boolean);

  if (!favorites.length) {
    wrapper.classList.add("hidden");
    list.innerHTML = "";
    return;
  }

  wrapper.classList.remove("hidden");
  list.innerHTML = favorites
    .map(
      (item) => `
        <a href="${item.url}" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-civil-light hover:text-civil-red transition-colors">
          <i data-lucide="star" class="w-4 h-4 text-amber-500 fill-current"></i>
          <span class="truncate">${item.title}</span>
        </a>
      `
    )
    .join("");
}

function renderDashboardEnhancements() {
  const dashboard = document.getElementById("dashboard");
  if (!dashboard) {
    return;
  }

  let smartZone = document.getElementById("dashboardSmartZone");
  if (!smartZone) {
    smartZone = document.createElement("section");
    smartZone.id = "dashboardSmartZone";
    smartZone.className = "space-y-6 mb-8";

    const quickAccessGrid = dashboard.querySelector(".quick-access-grid");
    if (quickAccessGrid && quickAccessGrid.parentNode) {
      quickAccessGrid.parentNode.insertBefore(smartZone, quickAccessGrid);
    } else {
      dashboard.appendChild(smartZone);
    }
  }

  const lastPageId = localStorage.getItem(STORAGE_KEYS.lastPage);
  const lastPage = SECTION_META.find((item) => item.id === lastPageId);
  const lastTrainingModule = Number(localStorage.getItem(STORAGE_KEYS.lastTrainingModule) || "0");
  const completedModules = getCompletedModules();
  const favorites = getFavorites()
    .map((id) => SECTION_META.find((item) => item.id === id))
    .filter(Boolean);

  const continueLabel =
    lastTrainingModule > 0 && completedModules.length < 11
      ? `Eğitim modül ${lastTrainingModule} ile devam et`
      : lastPage
        ? `${lastPage.title} sayfasına geri dön`
        : "Kasa Eğitim Modülü ile başla";

  const continueUrl =
    lastTrainingModule > 0 && completedModules.length < 11
      ? "kasa-egitim.html"
      : lastPage
        ? lastPage.url
        : "kasa-egitim.html";

  smartZone.innerHTML = `
    <div class="grid lg:grid-cols-3 gap-4">
      <div class="smart-card lg:col-span-2">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="smart-card-kicker">Akıllı Başlangıç</div>
            <h3 class="smart-card-title">Kaldığın yerden devam et</h3>
            <p class="smart-card-text">
              ${continueLabel}. Eğitim ilerlemen ve favori sayfaların bu cihazda saklanır.
            </p>
          </div>
          <div class="smart-card-icon bg-civil-light text-civil-red">
            <i data-lucide="rocket" class="w-5 h-5"></i>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-3">
          <a href="${continueUrl}" class="smart-action-primary">Devam Et</a>
          <button type="button" onclick="openCommandPalette()" class="smart-action-secondary">
            Hızlı Arama Aç
          </button>
        </div>
      </div>
      <div class="smart-card">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="smart-card-kicker">Mobil Hazırlık</div>
            <h3 class="smart-card-title">Uygulama gibi kullan</h3>
            <p class="smart-card-text">
              Çevrimdışı destek, ana ekrana ekleme ve hızlı erişim hazır.
            </p>
          </div>
          <div class="smart-card-icon bg-blue-50 text-blue-600">
            <i data-lucide="smartphone" class="w-5 h-5"></i>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-3">
          <button type="button" onclick="triggerInstallPrompt()" class="smart-action-primary ${deferredInstallPrompt ? "" : "smart-action-disabled"}">
            Yükle
          </button>
          <a href="kasa-egitim.html" class="smart-action-secondary">Eğitimi Aç</a>
        </div>
      </div>
    </div>
    <div class="smart-card">
      <div class="flex items-center justify-between gap-3 mb-4">
        <div>
          <div class="smart-card-kicker">Favori Kısayollar</div>
          <h3 class="smart-card-title">En sık kullanılan sayfalar</h3>
        </div>
        <button type="button" onclick="openCommandPalette()" class="text-sm font-semibold text-civil-red hover:underline">
          Favori ekle
        </button>
      </div>
      <div class="flex flex-wrap gap-3">
        ${
          favorites.length
            ? favorites
                .map(
                  (item) => `
                    <a href="${item.url}" class="favorite-pill">
                      <i data-lucide="star" class="w-4 h-4 text-amber-500 fill-current"></i>
                      ${item.title}
                    </a>
                  `
                )
                .join("")
            : '<div class="text-sm text-slate-500">Henüz favori seçilmedi. Sol menüde yıldız ikonuna dokunarak hızlı kısayol oluşturabilirsiniz.</div>'
        }
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function getCompletedModules() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEYS.completedModules) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (_) {
    return [];
  }
}

function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallUI();
    renderDashboardEnhancements();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    showToast("Uygulama cihaza eklendi.");
    updateInstallUI();
    renderDashboardEnhancements();
  });
}

function updateInstallUI() {
  const headerButton = document.getElementById("installAppButton");
  const floatingButton = document.getElementById("floatingInstallButton");
  const method = deferredInstallPrompt ? "remove" : "add";

  if (headerButton) {
    headerButton.classList[method]("hidden");
    headerButton.classList.add("flex");
  }

  if (floatingButton) {
    floatingButton.classList[method]("hidden");
  }
}

async function triggerInstallPrompt() {
  if (!deferredInstallPrompt) {
    showToast("Bu cihazda mağaza veya tarayıcı kurulum penceresi şu anda hazır değil.");
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice.catch(() => null);
  deferredInstallPrompt = null;
  updateInstallUI();
}

function updateConnectivityState(isInitial = false) {
  if (navigator.onLine) {
    if (isInitial) {
      lastConnectivityState = true;
      return;
    }
    if (lastConnectivityState === true) {
      return;
    }
    lastConnectivityState = true;
    showToast("Çevrimiçi moddasın. Son içerikler hazır.", "success", 1800);
  } else {
    lastConnectivityState = false;
    showToast("Bağlantı kesildi. Önbelleğe alınan eğitim içerikleri kullanılacak.", "warning", 3200);
  }
}

function showToast(message, tone = "success", duration = 2500) {
  const toast = document.getElementById("appStatusToast");
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.className = `app-status-toast ${tone}`;
  toast.classList.remove("hidden");

  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => {
    toast.classList.add("hidden");
  }, duration);
}

function openCommandPalette(initialValue = "") {
  const overlay = document.getElementById("commandPalette");
  const input = document.getElementById("commandPaletteInput");
  if (!overlay || !input) {
    return;
  }

  overlay.classList.remove("hidden");
  input.value = initialValue;
  renderCommandPaletteResults(initialValue);
  setTimeout(() => input.focus(), 30);
}

function closeCommandPalette() {
  const overlay = document.getElementById("commandPalette");
  if (overlay) {
    overlay.classList.add("hidden");
  }
}

function renderCommandPaletteResults(query) {
  const results = document.getElementById("commandPaletteResults");
  if (!results) {
    return;
  }

  const normalized = query.trim().toLowerCase();
  const ranked = SECTION_META.map((item) => {
    const haystack = [item.title, item.description, ...(item.keywords || [])]
      .join(" ")
      .toLowerCase();
    const matchScore =
      !normalized
        ? 1
        : haystack.includes(normalized)
          ? 3
          : item.keywords.some((keyword) => normalized.includes(keyword) || keyword.includes(normalized))
            ? 2
            : 0;

    return { item, matchScore };
  })
    .filter(({ matchScore }) => matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore || a.item.title.localeCompare(b.item.title, "tr"));

  results.innerHTML = ranked.length
    ? ranked
        .slice(0, 8)
        .map(
          ({ item }) => `
            <div
              class="command-result-item"
              role="button"
              tabindex="0"
              onclick="navigateToRoute('${item.id}')"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();navigateToRoute('${item.id}');}"
            >
              <div>
                <div class="command-result-title">${item.title}</div>
                <div class="command-result-text">${item.description}</div>
              </div>
              <div class="command-result-actions">
                <button
                  type="button"
                  class="command-favorite-btn"
                  onclick="event.stopPropagation(); toggleFavorite('${item.id}'); renderCommandPaletteResults(document.getElementById('commandPaletteInput').value);"
                >
                  <i data-lucide="star" class="w-4 h-4 ${isFavorite(item.id) ? "fill-current text-amber-500" : "text-slate-300"}"></i>
                </button>
                <i data-lucide="arrow-up-right" class="w-4 h-4 text-slate-400"></i>
              </div>
            </div>
          `
        )
        .join("")
    : `<div class="command-empty-state">Bu arama için bir sonuç bulunamadı. "iade", "taksit", "portal" gibi daha kısa bir ifade deneyin.</div>`;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function navigateToRoute(sectionId) {
  const meta = SECTION_META.find((item) => item.id === sectionId);
  if (!meta) {
    return;
  }

  closeCommandPalette();
  window.location.href = meta.url;
}

function navigateByKeyword(query) {
  const normalized = query.toLowerCase();

  for (const item of SECTION_META) {
    const values = [item.id, item.title, ...(item.keywords || [])];
    if (values.some((value) => normalized.includes(String(value).toLowerCase()))) {
      return item.id;
    }
  }

  return null;
}

function handleChatRequest(event) {
  event.preventDefault();
  const input = document.getElementById("llmInput");
  const userText = input ? input.value.trim() : "";
  if (!userText) {
    return;
  }

  if (input) {
    input.value = "";
  }

  const targetSectionId = navigateByKeyword(userText);
  if (targetSectionId) {
    const exists = document.getElementById(targetSectionId);
    if (exists) {
      showSection(targetSectionId);
      closeChat();
    } else {
      const url = SECTION_ROUTES[targetSectionId] || "dashboard.html";
      window.location.href = url;
    }
    return;
  }

  closeChat();
  openCommandPalette(userText);
}

function addChatMessage(text, sender) {
  const messagesContainer = document.getElementById("chatMessages");
  if (!messagesContainer) {
    return;
  }

  const messageDiv = document.createElement("div");
  const messageSpan = document.createElement("span");
  messageDiv.className = `message mb-2 ${sender === "user" ? "text-right" : "text-left"}`;
  messageSpan.className = `inline-block p-2 rounded-lg max-w-[85%] ${
    sender === "user" ? "bg-civil-red text-white" : "bg-slate-200 text-slate-800"
  }`;
  messageSpan.textContent = text;
  messageDiv.appendChild(messageSpan);
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showSection(sectionId) {
  if (window.innerWidth < 1024) {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("mobileOverlay");
    if (sidebar) {
      sidebar.classList.add("-translate-x-full");
    }
    if (overlay) {
      overlay.classList.add("hidden");
    }
  }

  document.querySelectorAll(".content-section").forEach((el) => {
    el.classList.add("hidden");
    el.classList.remove("block");
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove("hidden");
    target.classList.add("block");
  }

  const meta = SECTION_META.find((item) => item.id === sectionId);
  const title = meta ? meta.title : "Kasa Asistanım";
  const pageTitleEl = document.getElementById("pageTitle");
  const mobileTitleEl = document.getElementById("mobileTitle");
  if (pageTitleEl) {
    pageTitleEl.innerText = title;
  }
  if (mobileTitleEl) {
    mobileTitleEl.innerText = title;
  }

  document.querySelectorAll(".nav-item").forEach((btn) => {
    if (btn.dataset.target === sectionId) {
      btn.classList.add("bg-civil-light", "text-civil-red");
      btn.classList.remove("text-slate-600");
    } else {
      btn.classList.remove("bg-civil-light", "text-civil-red");
      btn.classList.add("text-slate-600");
    }
  });

  const contentArea = document.getElementById("contentArea");
  if (contentArea) {
    contentArea.scrollTo(0, 0);
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("mobileOverlay");
  if (!sidebar || !overlay) {
    return;
  }

  if (sidebar.classList.contains("-translate-x-full")) {
    sidebar.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
  } else {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  }
}

function handleSearch(query) {
  const normalized = query.toLowerCase();
  const searchItems = document.querySelectorAll(".step-container");

  if (normalized.length > 2) {
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.add("hidden");
      section.classList.remove("block");
    });

    const mobileTitle = document.getElementById("mobileTitle");
    const pageTitle = document.getElementById("pageTitle");
    if (mobileTitle) {
      mobileTitle.innerText = "Arama Sonuçları";
    }
    if (pageTitle) {
      pageTitle.innerText = "Arama Sonuçları";
    }

    searchItems.forEach((item) => {
      if (item.innerText.toLowerCase().includes(normalized)) {
        item.classList.remove("hidden");
        const section = item.closest(".content-section");
        if (section) {
          section.classList.remove("hidden");
          section.classList.add("block");
        }
      } else {
        item.classList.add("hidden");
      }
    });

    document.querySelectorAll(".content-section").forEach((section) => {
      const visibleItems = section.querySelectorAll(".step-container:not(.hidden)").length;
      if (visibleItems === 0) {
        section.classList.add("hidden");
      }
    });
  } else if (normalized.length === 0) {
    showSection("dashboard");
    searchItems.forEach((item) => item.classList.remove("hidden"));
  }
}

function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    return;
  }

  element.select();
  document.execCommand("copy");

  const button = element.nextElementSibling;
  if (!button) {
    return;
  }

  const originalText = button.innerText;
  button.innerText = "Kopyalandı!";
  button.classList.add("text-green-600", "bg-green-50");

  setTimeout(() => {
    button.innerText = originalText;
    button.classList.remove("text-green-600", "bg-green-50");
  }, 2000);
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (!input) {
    return;
  }

  input.type = input.type === "password" ? "text" : "password";
}

function openModal(src) {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImage");
  if (!modal || !img) {
    return;
  }

  img.src = src;
  modal.classList.remove("hidden");
  setTimeout(() => img.classList.remove("scale-95"), 10);
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImage");
  if (!modal || !img || modal.classList.contains("hidden")) {
    return;
  }

  img.classList.add("scale-95");
  setTimeout(() => modal.classList.add("hidden"), 200);
}

function openChat() {
  const chatWidget = document.getElementById("chatWidget");
  const floatingBtn = document.getElementById("floatingChatButton");
  const input = document.getElementById("llmInput");

  if (chatWidget) {
    chatWidget.classList.remove("translate-y-[120%]");
  }
  if (floatingBtn) {
    floatingBtn.classList.add("hidden");
  }
  if (input) {
    input.value = "";
  }

  if (window.innerWidth < 1024) {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("mobileOverlay");
    if (sidebar) {
      sidebar.classList.add("-translate-x-full");
    }
    if (overlay) {
      overlay.classList.add("hidden");
    }
  }
}

function closeChat() {
  const chatWidget = document.getElementById("chatWidget");
  const floatingBtn = document.getElementById("floatingChatButton");
  if (chatWidget) {
    chatWidget.classList.add("translate-y-[120%]");
  }
  if (floatingBtn) {
    floatingBtn.classList.remove("hidden");
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker
    .register("./sw.js")
    .catch(() => {});
}
