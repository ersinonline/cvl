// === API Ayarları (şu an kullanılmıyor ama ilerde lazım olabilir) ===
const API_KEY = "";
const LLM_MODEL = "gemini-2.5-flash-preview-09-2025";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/" +
  LLM_MODEL +
  ":generateContent?key=" +
  API_KEY;

// Tailwind config (Play CDN) – merkezi ayar
try {
  const cfg = {
    theme: {
      extend: {
        colors: {
          civil: { red: '#dd3612', dark: '#c22f0f', light: '#fff1f0', bg: '#f8fafc' }
        },
        fontFamily: { sans: ['Inter', 'sans-serif'] }
      }
    }
  };
  if (typeof tailwind !== 'undefined') {
    tailwind.config = cfg;
  } else {
    window.tailwind = { config: cfg };
  }
} catch (_) {}

// Global sayfa yönlendirme haritası
const SECTION_ROUTES = {
  dashboard: 'dashboard.html',
  raporlar: 'raporlar.html',
  'pos-islemleri': 'pos-islemleri.html',
  'ozel-odemeler': 'ozel-odemeler.html',
  'nakit-yatirma': 'nakit-yatirma.html',
  'kasa-duzeltme': 'kasa-duzeltme.html',
  'masraf-duzeltme': 'masraf-duzeltme.html',
  'fatura-portal': 'fatura-portal.html',
  taksitler: 'taksitler.html',
  sablon: 'sablon.html',
  'havale-eft': 'havale-eft.html',
  chippin: 'chippin.html',
  'gorus-oneri': 'gorus-oneri.html',
};

// === Lucide ikonları yükle ===
document.addEventListener("DOMContentLoaded", () => {
  try {
    const currentPage = (location.pathname.split('/').pop() || '').toLowerCase();
    if (currentPage === '' || currentPage === 'index.html') {
      window.location.href = 'dashboard.html';
      return;
    }
  } catch (_) {}

  if (window.lucide) {
    lucide.createIcons();
  }

  const existingChatWidget = document.getElementById('chatWidget');
  if (!existingChatWidget) {
    fetch('chat.html')
      .then(r => r.text())
      .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
        if (window.lucide) lucide.createIcons();
        const form = document.getElementById('chatForm');
        if (form) form.addEventListener('submit', handleChatRequest);
        const input = document.getElementById('llmInput');
        if (input) {
          input.addEventListener('keydown', function(e){
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
            }
          });
        }
      })
      .catch(() => {});
  }

  const existingImageModal = document.getElementById('imageModal');
  if (!existingImageModal) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="imageModal" class="fixed inset-0 bg-black/90 z-50 hidden flex items-center justify-center p-4 image-modal" onclick="closeModal()">
        <img id="modalImage" src="" class="max-w-full max-h-[90vh] rounded-lg shadow-2xl transform transition-transform scale-95">
        <button class="absolute top-5 right-5 text-white p-2 hover:bg-white/20 rounded-full transition-colors">
          <i data-lucide="x" class="w-8 h-8"></i>
        </button>
      </div>
    `);
    if (window.lucide) lucide.createIcons();
  }

  const mount = document.getElementById('sidebarMount');
  if (mount) {
    fetch('sidebar.html')
      .then(r => r.text())
      .then(html => {
        mount.innerHTML = html;
        if (window.lucide) lucide.createIcons();
        const current = (location.pathname.split('/').pop() || '').toLowerCase();
        document.querySelectorAll('#sidebar .nav-item').forEach(a => {
          const href = (a.getAttribute('href') || '').toLowerCase();
          if (href && current && href.endsWith(current)) {
            a.classList.add('bg-civil-light','text-civil-red');
            a.classList.remove('text-slate-600');
          } else {
            a.classList.remove('bg-civil-light','text-civil-red');
            a.classList.add('text-slate-600');
          }
        });
      })
      .catch(() => {});
  }

  // Analytics yükleme
  (function loadAnalytics(){
    try {
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);} 
      gtag('js', new Date());
      gtag('config', 'G-EPWVHCCP00');
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=G-EPWVHCCP00';
      document.head.appendChild(s);
    } catch(_) {}
  })();

  const headerMount = document.getElementById('headerMount');
  if (headerMount) {
    fetch('header.html')
      .then(r => r.text())
      .then(html => {
        headerMount.innerHTML = html;
        if (window.lucide) lucide.createIcons();
      })
      .catch(() => {});
  }

  // SECTION_ROUTES global tanımlı

  const hash = window.location.hash.replace('#', '');
  const targetEl = hash ? document.getElementById(hash) : null;
  if (hash && !targetEl) {
    const url = SECTION_ROUTES[hash];
    if (url) {
      window.location.href = url;
      return;
    }
  }

  const defaultSection = (targetEl?.id) || (document.getElementById('dashboard') ? 'dashboard' : (document.querySelector('.content-section')?.id || null));
  if (defaultSection) showSection(defaultSection);

  // Chat form submit
  const chatForm = document.getElementById("chatForm");
  const llmInput = document.getElementById("llmInput");

  if (chatForm) {
    chatForm.addEventListener("submit", handleChatRequest);
  }

  // Enter (shift'siz) ile gönderme
  if (llmInput) {
    llmInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (chatForm) {
          chatForm.dispatchEvent(new Event("submit", { cancelable: true }));
        }
      }
    });
  }

  // Service Worker kaydı dev ortamda devre dışı
});

// === Service Worker ===
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("Service Worker aktif (offline mod hazır)."))
      .catch((err) => console.log("Service Worker hatası:", err));
  }
}

// === Kılavuz içeriğini düz metin olarak almak için (şu an kullanılmıyor) ===
function getFullContextText() {
  let context = "";
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => {
    const title = section.querySelector("h2");
    if (title) {
      context += `\n--- BÖLÜM: ${title.textContent.trim()} ---\n`;
    }
    section.querySelectorAll(".step-container").forEach((step) => {
      const stepTitle = step.querySelector(".step-title");
      const stepContent = step.querySelector(".step-content p");
      if (stepTitle && stepContent) {
        context += `- ${stepTitle.textContent.trim()}: ${stepContent.textContent.trim()}\n`;
      }
    });
  });

  const taksitSection = document.getElementById("taksitler");
  if (taksitSection) {
    context += "\n--- EK KURALLAR: TAKSİT SEÇENEKLERİ ---\n";
    taksitSection.querySelectorAll("ul.list-disc li").forEach((li) => {
      context += `- ${li.textContent.trim()}\n`;
    });
    taksitSection.querySelectorAll("h3").forEach((h3) => {
      context += `- Kural: ${h3.textContent.trim()}\n`;
    });
  }

  return context;
}

// === Basit Anahtar Kelimeye Göre Yönlendirme ===
function navigateByKeyword(query) {
  query = query.toLowerCase();

  const keywordMap = {
    pos: "pos-islemleri",
    iade: "pos-islemleri",
    iptal: "pos-islemleri",
    taksit: "taksitler",
    vade: "taksitler",
    chippin: "chippin",
    setcard: "ozel-odemeler",
    hediye: "ozel-odemeler",
    "hediye kartı": "ozel-odemeler",
    iwallet: "ozel-odemeler",
    ederned: "ozel-odemeler", // yazım hatalı arayanlar için
    edenred: "ozel-odemeler", // doğru yazım
    nakit: "nakit-yatirma",
    "nakit yatırma": "nakit-yatirma",
    "kasa hatası": "kasa-duzeltme",
    "işlem kayması": "kasa-duzeltme",
    kayma: "kasa-duzeltme",
    masraf: "masraf-duzeltme",
    "fiyat hatası": "masraf-duzeltme",
    fatura: "fatura-portal",
    portal: "fatura-portal",
    online: "fatura-portal",
    alışveriş: "fatura-portal",
    eticaret: "fatura-portal",
    "e-ticaret": "fatura-portal",
    rapor: "raporlar",
    qr: "pos-islemleri",
    "gün sonu": "pos-islemleri",
    slip: "pos-islemleri",
  };

  for (const [keyword, sectionId] of Object.entries(keywordMap)) {
    if (query.includes(keyword)) {
      return sectionId;
    }
  }
  return null;
}

// === Chat İşleyicisi ===
function handleChatRequest(e) {
  e.preventDefault();
  const input = document.getElementById("llmInput");
  const userText = input ? input.value.trim() : "";
  if (!userText) { return; }
  if (input) input.value = "";

  const targetSectionId = navigateByKeyword(userText);

  if (targetSectionId) {
    const exists = document.getElementById(targetSectionId);
    if (exists) {
      showSection(targetSectionId);
      closeChat();
    } else {
      const url = SECTION_ROUTES[targetSectionId] || `index.html#${targetSectionId}`;
      window.location.href = url;
    }
  } else {
    closeChat();
  }
}

// === Mesaj Ekleme ===
function addChatMessage(text, sender) {
  const messagesContainer = document.getElementById("chatMessages");
  if (!messagesContainer) return;

  const messageDiv = document.createElement("div");
  const messageSpan = document.createElement("span");

  messageDiv.className = `message mb-2 ${
    sender === "user" ? "text-right" : "text-left"
  }`;

  messageSpan.className = `inline-block p-2 rounded-lg max-w-[85%] ${
    sender === "user"
      ? "bg-civil-red text-white"
      : "bg-slate-200 text-slate-800"
  }`;
  messageSpan.textContent = text;

  messageDiv.appendChild(messageSpan);
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// === Navigasyon & Arayüz Fonksiyonları ===
function showSection(sectionId) {
  if (window.innerWidth < 1024) {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("mobileOverlay");
    if (sidebar) sidebar.classList.add("-translate-x-full");
    if (overlay) overlay.classList.add("hidden");
  }

  document.querySelectorAll(".content-section").forEach((el) => {
    el.classList.add("hidden");
    el.classList.remove("block");
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove("hidden");
    target.classList.add("block");

    const pageTitleEl = document.getElementById("pageTitle");
    if (pageTitleEl) {
      pageTitleEl.innerText = "Kasa Asistanım";
    }
    const mobileTitleEl = document.getElementById("mobileTitle");
    if (mobileTitleEl) {
      mobileTitleEl.innerText = "Kasa Asistanım";
    }
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

  if (!sidebar || !overlay) return;

  if (sidebar.classList.contains("-translate-x-full")) {
    sidebar.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
  } else {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  }
}

// Basit text search (kılavuz içi)
function handleSearch(query) {
  query = query.toLowerCase();
  const searchItems = document.querySelectorAll(".step-container");

  if (query.length > 2) {
    document.querySelectorAll(".content-section").forEach((sec) => {
      sec.classList.add("hidden");
      sec.classList.remove("block");
    });
    const dashboard = document.getElementById("dashboard");
    if (dashboard) dashboard.classList.add("hidden");

    const mobileTitle = document.getElementById("mobileTitle");
    const pageTitle = document.getElementById("pageTitle");
    if (mobileTitle) mobileTitle.innerText = "Arama Sonuçları";
    if (pageTitle) pageTitle.innerText = "Arama Sonuçları";

    searchItems.forEach((item) => {
      if (item.innerText.toLowerCase().includes(query)) {
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

    document.querySelectorAll(".content-section").forEach((sec) => {
      const visibleItems = sec.querySelectorAll(".step-container:not(.hidden)")
        .length;
      if (visibleItems === 0) {
        sec.classList.add("hidden");
      }
    });
  } else if (query.length === 0) {
    showSection("dashboard");
    const mobileTitle = document.getElementById("mobileTitle");
    if (mobileTitle) mobileTitle.innerText = "Kasa Yardımcım";
    searchItems.forEach((item) => item.classList.remove("hidden"));
  }
}

// Kopyalama
function copyToClipboard(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.select();
  document.execCommand("copy");

  const btn = el.nextElementSibling;
  if (!btn) return;

  const originalText = btn.innerText;
  btn.innerText = "Kopyalandı!";
  btn.classList.add("text-green-600", "bg-green-50");

  setTimeout(() => {
    btn.innerText = originalText;
    btn.classList.remove("text-green-600", "bg-green-50");
  }, 2000);
}

// Şifre göster/gizle (şu an kullanılmıyor ama dursun)
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
}

// Görsel modal
function openModal(src) {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImage");
  if (!modal || !img) return;

  img.src = src;
  modal.classList.remove("hidden");
  setTimeout(() => img.classList.remove("scale-95"), 10);
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImage");
  if (!modal || !img) return;

  img.classList.add("scale-95");
  setTimeout(() => modal.classList.add("hidden"), 200);
}

// Chat aç/kapat
function openChat() {
  const chatWidget = document.getElementById("chatWidget");
  const floatingBtn = document.getElementById("floatingChatButton");
  const input = document.getElementById("llmInput");
  if (chatWidget) chatWidget.classList.remove("translate-y-[120%]");
  if (floatingBtn) floatingBtn.classList.add("hidden");
  if (input) input.value = "";
  if (window.innerWidth < 1024) {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("mobileOverlay");
    if (sidebar) sidebar.classList.add("-translate-x-full");
    if (overlay) overlay.classList.add("hidden");
  }
}

function closeChat() {
  const chatWidget = document.getElementById("chatWidget");
  const floatingBtn = document.getElementById("floatingChatButton");
  if (chatWidget) chatWidget.classList.add("translate-y-[120%]");
  if (floatingBtn) floatingBtn.classList.remove("hidden");
}
