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
            bg: "#f4f6f9",
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

/* Tema: flash önleme — mümkün olduğunca erken uygula */
(function applyThemeBoot() {
  try {
    const stored = localStorage.getItem("civilTheme") || "system";
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark", "theme-system");
    root.classList.add("theme-" + stored);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark-active", stored === "dark" || (stored === "system" && prefersDark));
  } catch (_) {}
})();

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
    description: "POS iptal, iade, gün sonu, QR ve slip işlemleri.",
    keywords: [
      "pos",
      "iade",
      "iptal",
      "gün sonu",
      "slip",
      "qr",
      "karekod",
      "akbank",
      "finansbank",
      "qnb",
      "garanti",
      "iş bankası",
      "fast",
    ],
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
  theme: "civilTheme",
  recentPages: "civilRecentPages",
};

const THEME_ORDER = ["system", "light", "dark"];
const RECENT_LIMIT = 3;
const PAGE_ICON_MAP = {
  dashboard: "layout-grid",
  raporlar: "bar-chart-2",
  "pos-islemleri": "credit-card",
  "ozel-odemeler": "gift",
  "nakit-yatirma": "wallet-2",
  "kasa-duzeltme": "alert-triangle",
  "masraf-duzeltme": "coins",
  "fatura-portal": "file-text",
  taksitler: "percent",
  sablon: "file-spreadsheet",
  "havale-eft": "refresh-ccw",
  chippin: "star",
  "gorus-oneri": "message-square",
  "kasa-egitim": "graduation-cap",
};

let deferredInstallPrompt = null;
let lastConnectivityState = navigator.onLine;
let commandPaletteActiveIndex = -1;

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

  initTheme();
  ensureSkipLink();
  ensureGlobalShell();
  loadSharedFragments();
  initializePageState();
  // QR kartları önce mount edilsin; sayfa filtresi onları da görsün
  if (document.getElementById("qrBankProceduresMount")) {
    renderQrBankProcedures();
  }
  enhanceContentPages();
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
  ensureShortcutsPanel();
}

function ensureSkipLink() {
  if (document.querySelector(".skip-link")) {
    return;
  }
  const link = document.createElement("a");
  link.href = "#contentArea";
  link.className = "skip-link";
  link.textContent = "İçeriğe atla";
  document.body.prepend(link);
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
  pushRecentPage();
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

  const isContentSection = targetEl && targetEl.classList.contains("content-section");
  const defaultSection =
    (isContentSection && targetEl.id) ||
    (document.getElementById("dashboard")
      ? "dashboard"
      : document.querySelector(".content-section")?.id || null);

  if (defaultSection) {
    showSection(defaultSection);
  }

  if (targetEl && !isContentSection) {
    setTimeout(() => {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
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

    const isSlash =
      event.key === "/" &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !isTypingInField(event.target);
    if (isSlash) {
      event.preventDefault();
      openCommandPalette();
      return;
    }

    const isHelp =
      (event.key === "?" || (event.shiftKey && event.key === "/")) &&
      !isTypingInField(event.target);
    if (isHelp) {
      event.preventDefault();
      toggleShortcutsHelp(true);
      return;
    }

    if (event.key === "Escape") {
      closeCommandPalette();
      closeShortcutsHelp();
      closeModal();
      return;
    }

    const paletteOpen = !document.getElementById("commandPalette")?.classList.contains("hidden");
    if (paletteOpen && (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter")) {
      handleCommandPaletteKeys(event);
    }
  });

  window.addEventListener("online", () => updateConnectivityState(false));
  window.addEventListener("offline", () => updateConnectivityState(false));

  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (getThemePreference() === "system") {
        applyTheme("system");
      }
    });
  } catch (_) {}
}

function isTypingInField(target) {
  if (!target) {
    return false;
  }
  const tag = (target.tagName || "").toLowerCase();
  return tag === "input" || tag === "textarea" || target.isContentEditable;
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
            <div class="command-suggest-row" id="commandSuggestChips">
              <button type="button" class="filter-chip" data-suggest="iade">iade</button>
              <button type="button" class="filter-chip" data-suggest="qr">qr</button>
              <button type="button" class="filter-chip" data-suggest="taksit">taksit</button>
              <button type="button" class="filter-chip" data-suggest="chippin">chippin</button>
              <button type="button" class="filter-chip" data-suggest="nakit">nakit</button>
              <button type="button" class="filter-chip" data-suggest="rapor">rapor</button>
            </div>
          </div>
          <div id="commandPaletteResults" class="command-palette-results"></div>
        </div>
      </div>
      <div id="appStatusToast" class="app-status-toast hidden"></div>
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

  document.querySelectorAll("#commandSuggestChips [data-suggest]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const value = chip.getAttribute("data-suggest") || "";
      if (input) {
        input.value = value;
        input.focus();
      }
      renderCommandPaletteResults(value);
      document.querySelectorAll("#commandSuggestChips .filter-chip").forEach((el) => {
        el.classList.toggle("is-active", el === chip);
      });
    });
  });

  renderCommandPaletteResults("");
  updateInstallUI();

  if (window.lucide) {
    lucide.createIcons();
  }
}

function refreshSidebarState() {
  highlightCurrentRoute();
  decorateSidebarFavorites();
  renderSidebarFavorites();
  renderSidebarRecent();
  updateInstallUI();

  if (window.lucide) {
    lucide.createIcons();
  }
}

function refreshHeaderState() {
  updateInstallUI();
  syncThemeToggleButtons();
  updateConnectivityPill();

  if (window.lucide) {
    lucide.createIcons();
  }
}

/* ——— Tema ——— */
function getThemePreference() {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.theme) || "system";
    return THEME_ORDER.includes(value) ? value : "system";
  } catch (_) {
    return "system";
  }
}

function initTheme() {
  applyTheme(getThemePreference());
}

function applyTheme(theme) {
  const next = THEME_ORDER.includes(theme) ? theme : "system";
  const root = document.documentElement;
  root.classList.remove("theme-light", "theme-dark", "theme-system");
  root.classList.add("theme-" + next);

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = next === "dark" || (next === "system" && prefersDark);
  root.classList.toggle("dark-active", isDark);

  try {
    localStorage.setItem(STORAGE_KEYS.theme, next);
  } catch (_) {}

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute("content", isDark ? "#0b1220" : "#dd3612");
  }

  syncThemeToggleButtons();
}

function cycleTheme() {
  const current = getThemePreference();
  const index = THEME_ORDER.indexOf(current);
  const next = THEME_ORDER[(index + 1) % THEME_ORDER.length];
  applyTheme(next);
  const labels = { system: "Sistem teması", light: "Açık tema", dark: "Koyu tema" };
  showToast(labels[next] + " uygulandı.", "success", 1600);
}

function syncThemeToggleButtons() {
  const theme = getThemePreference();
  const icon = theme === "dark" ? "sun" : theme === "light" ? "moon" : "monitor";
  const label =
    theme === "dark"
      ? "Tema: koyu (tıkla: sistem)"
      : theme === "light"
        ? "Tema: açık (tıkla: koyu)"
        : "Tema: sistem (tıkla: açık)";

  document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
    btn.dataset.theme = theme;
    btn.title = label;
    btn.setAttribute("aria-label", label);
    btn.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5"></i>`;
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

/* ——— Son bakılanlar ——— */
function getRecentPages() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.recentPages) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch (_) {
    return [];
  }
}

function setRecentPages(ids) {
  localStorage.setItem(STORAGE_KEYS.recentPages, JSON.stringify(ids.slice(0, RECENT_LIMIT)));
}

function pushRecentPage() {
  const meta = getCurrentSectionMeta();
  if (!meta || meta.id === "dashboard") {
    return;
  }

  const next = [meta.id, ...getRecentPages().filter((id) => id !== meta.id)].slice(0, RECENT_LIMIT);
  setRecentPages(next);
}

function renderSidebarRecent() {
  const wrapper = document.getElementById("sidebarRecentSection");
  const list = document.getElementById("sidebarRecentList");
  if (!wrapper || !list) {
    return;
  }

  const recent = getRecentPages()
    .map((id) => SECTION_META.find((item) => item.id === id))
    .filter(Boolean);

  if (!recent.length) {
    wrapper.classList.add("hidden");
    list.innerHTML = "";
    return;
  }

  wrapper.classList.remove("hidden");
  list.innerHTML = recent
    .map(
      (item) => `
        <a href="${item.url}" class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-civil-light hover:text-civil-red transition-colors">
          <i data-lucide="history" class="w-4 h-4 text-slate-400"></i>
          <span class="truncate">${item.title}</span>
        </a>
      `
    )
    .join("");
}

/* ——— Sayfa araç çubuğu / filtre ——— */
function enhanceContentPages() {
  const section = document.querySelector(".content-section:not(#dashboard)");
  if (!section || section.dataset.enhanced === "1") {
    return;
  }

  const meta = getCurrentSectionMeta();
  const heading = section.querySelector(":scope > h2");
  if (heading && meta) {
    const iconName = PAGE_ICON_MAP[meta.id] || "book-open";
    const hero = document.createElement("div");
    hero.className = "page-hero";
    hero.innerHTML = `
      <div>
        <h2 class="page-hero-title">
          <span class="page-hero-icon"><i data-lucide="${iconName}" class="w-5 h-5"></i></span>
          ${meta.title}
        </h2>
        <p class="page-hero-sub">${meta.description}</p>
      </div>
      <button type="button" class="smart-action-secondary favorite-page-btn" data-section="${meta.id}">
        <i data-lucide="star" class="w-4 h-4 ${isFavorite(meta.id) ? "fill-current text-amber-500" : ""}"></i>
        ${isFavorite(meta.id) ? "Favoride" : "Favorile"}
      </button>
    `;
    heading.replaceWith(hero);

    const favBtn = hero.querySelector(".favorite-page-btn");
    if (favBtn) {
      favBtn.addEventListener("click", () => {
        toggleFavorite(meta.id);
        favBtn.innerHTML = `
          <i data-lucide="star" class="w-4 h-4 ${isFavorite(meta.id) ? "fill-current text-amber-500" : ""}"></i>
          ${isFavorite(meta.id) ? "Favoride" : "Favorile"}
        `;
        if (window.lucide) {
          lucide.createIcons();
        }
      });
    }
  }

  const filterTargets = section.querySelectorAll(".step-container, .guide-card, .search-item");
  if (filterTargets.length >= 2) {
    const chipLabels = buildPageFilterChips(section);
    const toolbar = document.createElement("div");
    toolbar.className = "page-toolbar search-panel";
    toolbar.innerHTML = `
      <div class="search-panel-head">
        <div class="page-filter-wrap">
          <i data-lucide="search" class="page-filter-icon"></i>
          <input
            id="pageFilterInput"
            type="search"
            class="page-filter-input"
            placeholder="Bu sayfada ara — adım, kural, banka..."
            autocomplete="off"
            aria-label="Sayfa içi arama"
          >
          <button type="button" id="pageFilterClear" class="page-filter-clear hidden" aria-label="Aramayı temizle">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>
        <span id="pageFilterMeta" class="page-filter-meta">
          <i data-lucide="list-filter" class="w-3.5 h-3.5"></i>
          ${filterTargets.length} madde
        </span>
      </div>
      <div class="filter-chip-row" id="pageFilterChips">
        <button type="button" class="filter-chip is-active" data-filter="">Tümü</button>
        ${chipLabels
          .map(
            (label) =>
              `<button type="button" class="filter-chip" data-filter="${escapeHtmlAttr(label)}">${escapeHtml(label)}</button>`
          )
          .join("")}
      </div>
    `;

    const empty = document.createElement("div");
    empty.id = "pageFilterEmpty";
    empty.className = "page-empty-state";
    empty.innerHTML = `
      <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-3 text-slate-400"></i>
      <p class="font-semibold mb-1">Sonuç bulunamadı</p>
      <p class="text-sm">Farklı bir anahtar kelime deneyin veya filtreyi temizleyin.</p>
      <button type="button" class="smart-action-secondary mt-4" id="pageFilterEmptyReset">Filtreyi temizle</button>
    `;

    const insertBefore = section.querySelector(".grid, .space-y-6, .search-container, .card-grid") || section.firstElementChild?.nextElementSibling;
    if (insertBefore) {
      section.insertBefore(toolbar, insertBefore);
    } else {
      section.appendChild(toolbar);
    }
    section.appendChild(empty);

    const input = toolbar.querySelector("#pageFilterInput");
    const clearBtn = toolbar.querySelector("#pageFilterClear");

    if (input) {
      input.addEventListener("input", (event) => {
        const value = event.target.value;
        if (clearBtn) {
          clearBtn.classList.toggle("hidden", !value.trim());
        }
        syncFilterChipActive(value);
        filterCurrentPage(value);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (input) {
          input.value = "";
          input.focus();
        }
        clearBtn.classList.add("hidden");
        syncFilterChipActive("");
        filterCurrentPage("");
      });
    }

    toolbar.querySelectorAll("#pageFilterChips .filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const value = chip.getAttribute("data-filter") || "";
        if (input) {
          input.value = value;
          if (clearBtn) {
            clearBtn.classList.toggle("hidden", !value);
          }
        }
        syncFilterChipActive(value);
        filterCurrentPage(value);
      });
    });

    const emptyReset = empty.querySelector("#pageFilterEmptyReset");
    if (emptyReset) {
      emptyReset.addEventListener("click", () => {
        if (input) {
          input.value = "";
        }
        if (clearBtn) {
          clearBtn.classList.add("hidden");
        }
        syncFilterChipActive("");
        filterCurrentPage("");
      });
    }
  }

  section.dataset.enhanced = "1";

  if (window.lucide) {
    lucide.createIcons();
  }
}

function buildPageFilterChips(section) {
  const titles = Array.from(section.querySelectorAll(".step-title"))
    .map((el) => (el.textContent || "").trim())
    .filter(Boolean);

  const chips = [];
  const seen = new Set();

  titles.forEach((title) => {
    const short = title.length > 28 ? title.slice(0, 26).trim() + "…" : title;
    const key = short.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      chips.push(short.replace(/…$/, "") === short ? short : title.slice(0, 22).trim());
    }
  });

  // Kısa etiket tercih et; en fazla 5 chip
  return chips
    .map((label) => (label.length > 22 ? label.slice(0, 20).trim() + "…" : label))
    .slice(0, 5);
}

function syncFilterChipActive(query) {
  const normalized = (query || "").trim().toLowerCase();
  document.querySelectorAll("#pageFilterChips .filter-chip").forEach((chip) => {
    const value = (chip.getAttribute("data-filter") || "").trim().toLowerCase();
    const isAll = value === "";
    chip.classList.toggle(
      "is-active",
      isAll ? !normalized : normalized === value || (!!normalized && value.includes(normalized))
    );
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtmlAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function filterCurrentPage(query) {
  const section = document.querySelector(".content-section:not(#dashboard)");
  if (!section) {
    return;
  }

  const normalized = query.trim().toLowerCase();
  const items = section.querySelectorAll(".step-container, .guide-card.search-item, .search-item");
  let visible = 0;

  items.forEach((item) => {
    const match = !normalized || item.innerText.toLowerCase().includes(normalized);
    item.classList.toggle("hidden", !match);
    if (match) {
      visible += 1;
    }
  });

  const meta = document.getElementById("pageFilterMeta");
  if (meta) {
    meta.innerHTML = normalized
      ? `<i data-lucide="list-filter" class="w-3.5 h-3.5"></i> ${visible} / ${items.length}`
      : `<i data-lucide="list-filter" class="w-3.5 h-3.5"></i> ${items.length} madde`;
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  const empty = document.getElementById("pageFilterEmpty");
  if (empty) {
    empty.classList.toggle("visible", visible === 0);
  }
}

/* ——— Kısayol paneli ——— */
function ensureShortcutsPanel() {
  if (document.getElementById("shortcutsPanel")) {
    return;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div id="shortcutsPanel" class="shortcuts-panel hidden" role="dialog" aria-modal="true" aria-labelledby="shortcutsTitle">
        <div class="shortcuts-card">
          <div class="flex items-center justify-between mb-2">
            <h3 id="shortcutsTitle">Klavye Kısayolları</h3>
            <button type="button" class="header-icon-btn" onclick="closeShortcutsHelp()" aria-label="Kapat">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
          <div class="shortcut-row"><span>Hızlı arama</span><span class="kbd-chip">Ctrl K</span></div>
          <div class="shortcut-row"><span>Hızlı arama (alternatif)</span><span class="kbd-chip">/</span></div>
          <div class="shortcut-row"><span>Bu paneli aç</span><span class="kbd-chip">?</span></div>
          <div class="shortcut-row"><span>Kapat</span><span class="kbd-chip">Esc</span></div>
          <div class="shortcut-row"><span>Tema değiştir</span><span class="text-sm">Header’daki güneş/ay</span></div>
          <p class="text-xs text-slate-500 mt-4">Favoriler sol menüdeki yıldız ile eklenir; son bakılanlar otomatik kaydedilir.</p>
        </div>
      </div>
    `
  );

  const panel = document.getElementById("shortcutsPanel");
  if (panel) {
    panel.addEventListener("click", (event) => {
      if (event.target === panel) {
        closeShortcutsHelp();
      }
    });
  }
}

function toggleShortcutsHelp(forceOpen) {
  const panel = document.getElementById("shortcutsPanel");
  if (!panel) {
    return;
  }
  const shouldOpen = forceOpen === true || panel.classList.contains("hidden");
  panel.classList.toggle("hidden", !shouldOpen);
  if (shouldOpen && window.lucide) {
    lucide.createIcons();
  }
}

function closeShortcutsHelp() {
  const panel = document.getElementById("shortcutsPanel");
  if (panel) {
    panel.classList.add("hidden");
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
      link.classList.add("bg-civil-light", "text-civil-red", "is-active");
      link.classList.remove("text-slate-600");
    } else {
      link.classList.remove("bg-civil-light", "text-civil-red", "is-active");
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
  const wasFavorite = favorites.includes(sectionId);
  const nextFavorites = wasFavorite
    ? favorites.filter((item) => item !== sectionId)
    : [...favorites, sectionId];

  setFavorites(nextFavorites);
  decorateSidebarFavorites();
  renderSidebarFavorites();
  renderDashboardEnhancements();
  showToast(wasFavorite ? "Favorilerden çıkarıldı." : "Favorilere eklendi.", "success", 1400);
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
  const recent = getRecentPages()
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

  const quickActions = [
    { title: "POS İade", url: "pos-islemleri.html", icon: "undo-2" },
    { title: "Taksitler", url: "taksitler.html", icon: "percent" },
    { title: "Havale/EFT", url: "havale-eft.html", icon: "refresh-ccw" },
    { title: "Raporlar", url: "raporlar.html", icon: "bar-chart-2" },
  ];

  smartZone.innerHTML = `
    <div class="grid lg:grid-cols-3 gap-4">
      <div class="smart-card lg:col-span-2">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="smart-card-kicker">Akıllı Başlangıç</div>
            <h3 class="smart-card-title">Kaldığın yerden devam et</h3>
            <p class="smart-card-text">
              ${continueLabel}. Eğitim ilerlemen, favoriler ve son bakılanlar bu cihazda saklanır.
            </p>
          </div>
          <div class="smart-card-icon">
            <i data-lucide="rocket" class="w-5 h-5"></i>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-3">
          <a href="${continueUrl}" class="smart-action-primary">Devam Et</a>
          <button type="button" onclick="openCommandPalette()" class="smart-action-secondary">
            Hızlı Arama Aç
          </button>
          <button type="button" onclick="cycleTheme()" class="smart-action-secondary">
            Tema Değiştir
          </button>
        </div>
      </div>
      <div class="smart-card">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="smart-card-kicker">Hızlı Aksiyonlar</div>
            <h3 class="smart-card-title">Sık ihtiyaç duyulanlar</h3>
            <p class="smart-card-text">Mağazada en çok açılan işlemlere tek dokunuş.</p>
          </div>
          <div class="smart-card-icon">
            <i data-lucide="zap" class="w-5 h-5"></i>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          ${quickActions
            .map(
              (item) => `
                <a href="${item.url}" class="favorite-pill">
                  <i data-lucide="${item.icon}" class="w-4 h-4 text-civil-red"></i>
                  ${item.title}
                </a>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
    <div class="grid lg:grid-cols-2 gap-4">
      <div class="smart-card">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div>
            <div class="smart-card-kicker">Favoriler</div>
            <h3 class="smart-card-title">Kısayolların</h3>
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
              : '<div class="text-sm text-slate-500">Henüz favori yok. Sol menüde yıldız ikonuna veya sayfa başındaki Favorile butonuna dokunun.</div>'
          }
        </div>
      </div>
      <div class="smart-card">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div>
            <div class="smart-card-kicker">Son Bakılanlar</div>
            <h3 class="smart-card-title">Geçmiş</h3>
          </div>
          <span class="text-xs font-semibold text-slate-400">Son 3</span>
        </div>
        <div class="flex flex-wrap gap-2">
          ${
            recent.length
              ? recent
                  .map(
                    (item) => `
                      <a href="${item.url}" class="recent-chip">
                        <i data-lucide="history" class="w-3.5 h-3.5 text-slate-400"></i>
                        ${item.title}
                      </a>
                    `
                  )
                  .join("")
              : '<div class="text-sm text-slate-500">Henüz geçmiş yok. Birkaç sayfa gezdikçe burada görünecek.</div>'
          }
        </div>
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
    if (isNativeCapacitorApp()) {
      deferredInstallPrompt = null;
      updateInstallUI();
      return;
    }
    deferredInstallPrompt = event;
    updateInstallUI();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    showToast("Uygulama cihaza eklendi.");
    updateInstallUI();
  });
}

function updateInstallUI() {
  const sidebarButton = document.getElementById("sidebarInstallButton");
  const headerButton = document.getElementById("installAppButton");
  const floatingButton = document.getElementById("floatingInstallButton");
  const canShow = !!deferredInstallPrompt && !isNativeCapacitorApp();

  if (sidebarButton) {
    sidebarButton.classList.toggle("hidden", !canShow);
    if (canShow && window.lucide) {
      lucide.createIcons();
    }
  }

  // Agresif / sticky install UI kapalı
  if (headerButton) {
    headerButton.classList.add("hidden");
    headerButton.classList.remove("flex");
  }
  if (floatingButton) {
    floatingButton.classList.add("hidden");
  }
}

async function triggerInstallPrompt() {
  if (!deferredInstallPrompt) {
    updateInstallUI();
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
      updateConnectivityPill();
      return;
    }
    if (lastConnectivityState === true) {
      updateConnectivityPill();
      return;
    }
    lastConnectivityState = true;
    updateConnectivityPill();
    showToast("Çevrimiçi moddasın. Son içerikler hazır.", "success", 1800);
  } else {
    lastConnectivityState = false;
    updateConnectivityPill();
    showToast("Bağlantı kesildi. Önbelleğe alınan eğitim içerikleri kullanılacak.", "warning", 3200);
  }
}

function updateConnectivityPill() {
  const pill = document.getElementById("connectivityPill");
  if (!pill) {
    return;
  }

  const online = navigator.onLine;
  pill.classList.toggle("is-online", online);
  pill.classList.toggle("is-offline", !online);
  pill.innerHTML = online
    ? `<i data-lucide="wifi" class="w-3.5 h-3.5"></i> Çevrimiçi`
    : `<i data-lucide="wifi-off" class="w-3.5 h-3.5"></i> Çevrimdışı`;

  if (window.lucide) {
    lucide.createIcons();
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

  closeShortcutsHelp();
  overlay.classList.remove("hidden");
  input.value = initialValue;
  commandPaletteActiveIndex = 0;
  renderCommandPaletteResults(initialValue);
  setTimeout(() => input.focus(), 30);
}

function closeCommandPalette() {
  const overlay = document.getElementById("commandPalette");
  if (overlay) {
    overlay.classList.add("hidden");
  }
  commandPaletteActiveIndex = -1;
}

function getCommandResultItems() {
  return Array.from(document.querySelectorAll("#commandPaletteResults .command-result-item"));
}

function syncCommandPaletteActive() {
  const items = getCommandResultItems();
  items.forEach((item, index) => {
    item.classList.toggle("is-active", index === commandPaletteActiveIndex);
  });
}

function handleCommandPaletteKeys(event) {
  const items = getCommandResultItems();
  if (!items.length) {
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    commandPaletteActiveIndex = (commandPaletteActiveIndex + 1) % items.length;
    syncCommandPaletteActive();
    items[commandPaletteActiveIndex].scrollIntoView({ block: "nearest" });
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    commandPaletteActiveIndex = (commandPaletteActiveIndex - 1 + items.length) % items.length;
    syncCommandPaletteActive();
    items[commandPaletteActiveIndex].scrollIntoView({ block: "nearest" });
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    const active = items[Math.max(0, commandPaletteActiveIndex)] || items[0];
    const sectionId = active?.dataset?.sectionId;
    if (sectionId) {
      navigateToRoute(sectionId);
    }
  }
}

function renderCommandPaletteResults(query) {
  const results = document.getElementById("commandPaletteResults");
  if (!results) {
    return;
  }

  const normalized = query.trim().toLowerCase();
  const favorites = getFavorites();
  const recent = getRecentPages();

  const ranked = SECTION_META.map((item) => {
    const haystack = [item.title, item.description, ...(item.keywords || [])]
      .join(" ")
      .toLowerCase();
    let matchScore =
      !normalized
        ? 1
        : haystack.includes(normalized)
          ? 3
          : item.keywords.some((keyword) => normalized.includes(keyword) || keyword.includes(normalized))
            ? 2
            : 0;

    if (matchScore > 0) {
      if (favorites.includes(item.id)) {
        matchScore += 0.4;
      }
      if (recent.includes(item.id)) {
        matchScore += 0.2;
      }
    }

    return { item, matchScore };
  })
    .filter(({ matchScore }) => matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore || a.item.title.localeCompare(b.item.title, "tr"));

  results.innerHTML = ranked.length
    ? ranked
        .slice(0, 8)
        .map(
          ({ item }, index) => `
            <div
              class="command-result-item ${index === 0 ? "is-active" : ""}"
              role="button"
              tabindex="0"
              data-section-id="${item.id}"
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
                  aria-label="Favori"
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

  commandPaletteActiveIndex = ranked.length ? 0 : -1;

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

function getQrBankProcedures() {
  return window.QR_BANK_PROCEDURES || [];
}

function renderQrBankProcedures(mountId = "qrBankProceduresMount") {
  const mount = document.getElementById(mountId);
  const procedures = getQrBankProcedures();
  if (!mount || !procedures.length) {
    return;
  }

  const cards = procedures
    .map((bank) => {
      const ops = (bank.operations || [])
        .map((op) => {
          const typeBadge =
            op.type === "iptal"
              ? '<span class="qr-badge qr-badge-iptal">İptal</span>'
              : '<span class="qr-badge qr-badge-iade">İade</span>';

          const menu = (op.menuPath || [])
            .map((part) => `<code class="qr-code-chip">${escapeHtml(part)}</code>`)
            .join(' <span class="qr-menu-sep">›</span> ');

          const fields = (op.requiredFields || [])
            .map((field) => {
              let extra = "";
              if (
                field.key === "merchantPassword" &&
                op.merchantPasswordGuideDefault
              ) {
                extra = ` — banka kılavuzu örneği: <code class="qr-code-chip qr-code-chip-warn">${escapeHtml(op.merchantPasswordGuideDefault)}</code> <span class="qr-muted">(değişmiş olabilir; mağazadan doğrulayın)</span>`;
              } else if (field.key === "merchantPassword") {
                extra = ` <span class="qr-muted">(mağaza yöneticisinden alın)</span>`;
              }
              return `<li><b class="font-semibold">${escapeHtml(field.label)}</b>: ${escapeHtml(field.source)}${extra}</li>`;
            })
            .join("");

          const steps = (op.steps || [])
            .map((step) => `<li>${escapeHtml(step)}</li>`)
            .join("");

          return `
            <div class="qr-op-card space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                ${typeBadge}
                <h5 class="qr-op-title">${escapeHtml(op.title)}</h5>
              </div>
              <p class="qr-body"><span class="font-semibold">Menü:</span> ${menu}</p>
              <div>
                <p class="qr-label">Gerekli alanlar</p>
                <ul class="list-disc ml-5 qr-body space-y-0.5">${fields}</ul>
              </div>
              <div>
                <p class="qr-label">Adımlar</p>
                <ol class="list-decimal ml-5 qr-body space-y-0.5">${steps}</ol>
              </div>
            </div>
          `;
        })
        .join("");

      const notes = (bank.notes || [])
        .map((note) => `<li>${escapeHtml(note)}</li>`)
        .join("");

      const supportBits = [];
      if (bank.supportPhone) {
        supportBits.push(`Destek: <b class="font-semibold">${escapeHtml(bank.supportPhone)}</b>`);
      }
      if (bank.supportEmail) {
        supportBits.push(`E-posta: <b class="font-semibold">${escapeHtml(bank.supportEmail)}</b>`);
      }

      const images = (bank.images || [])
        .map(
          (img) => `
            <img
              src="${escapeHtml(img.src)}"
              alt="${escapeHtml(img.alt || bank.bank)}"
              class="step-image"
              onclick="openModal(this.src)"
            >
          `
        )
        .join("");

      return `
        <div class="step-container search-item" data-bank="${escapeHtml(bank.id)}">
          <div class="step-header">
            <div class="step-number"><i data-lucide="qr-code" class="w-4 h-4"></i></div>
            <h3 class="step-title">${escapeHtml(bank.bank)} — QR İptal / İade</h3>
          </div>
          <div class="step-content space-y-4">
            ${supportBits.length ? `<p class="qr-body">${supportBits.join(" · ")}</p>` : ""}
            ${notes ? `<ul class="list-disc ml-5 qr-body space-y-1">${notes}</ul>` : ""}
            <div class="space-y-3">${ops}</div>
            ${images ? `<div class="grid sm:grid-cols-2 gap-3 pt-1">${images}</div>` : ""}
          </div>
        </div>
      `;
    })
    .join("");

  mount.innerHTML = `
    <div class="guide-card search-item qr-intro-card mb-4">
      <h3 class="qr-intro-title flex items-center gap-2">
        <i data-lucide="scan-line" class="w-5 h-5 text-civil-red"></i>
        Banka Bazlı QR (Karekod) İptal / İade
      </h3>
      <p class="qr-body leading-relaxed">
        Aynı gün ve gün sonu öncesi işlemler genelde <b class="font-semibold">iptal</b>, gün sonu sonrası
        <b class="font-semibold">iade</b> olarak ilerler. Aşağıdaki adımlar ilgili bankanın POS menüsüne göredir.
        İşyeri şifreleri mağaza yöneticisinde tanımlıdır; banka kılavuzundaki örnek değerler değişmiş olabilir.
      </p>
    </div>
    <div class="grid md:grid-cols-2 gap-6">${cards}</div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
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
