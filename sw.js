document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  showSection("dashboard");

  const chatForm = document.getElementById("chatForm");
  const llmInput = document.getElementById("llmInput");

  if (chatForm) {
    chatForm.addEventListener("submit", handleChatRequest);
  }

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

  // Service Worker kaydı
  registerServiceWorker();
});

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("Service Worker aktif (offline mod hazır)."))
      .catch((err) => console.log("Service Worker hatası:", err));
  }
}

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
    rapor: "raporlar",
  };

  for (const [keyword, sectionId] of Object.entries(keywordMap)) {
    if (query.includes(keyword)) {
      return sectionId;
    }
  }
  return null;
}

function handleChatRequest(e) {
  e.preventDefault();
  const input = document.getElementById("llmInput");
  const responseArea = document.getElementById("llmResponseArea");
  const userText = input.value.trim();

  if (!userText) {
    responseArea.textContent = "Lütfen bir anahtar kelime veya soru girin.";
    responseArea.classList.remove("hidden");
    return;
  }

  addChatMessage(userText, "user");
  input.value = "";

  const targetSectionId = navigateByKeyword(userText);

  if (targetSectionId) {
    showSection(targetSectionId);
    const pageTitleEl = document.getElementById("pageTitle");
    const currentTitle = pageTitleEl ? pageTitleEl.innerText : "";
    addChatMessage(
      `"${userText}" anahtar kelimesi ile ilgili olarak sizi "${currentTitle}" bölümüne yönlendiriyorum.`,
      "bot"
    );

    // Yönlendirme başarılıysa chat'i kapat
    closeChat();
  } else {
    addChatMessage(
      `"${userText}" için özel bir sayfa bulunamadı, ancak yardımcı olmaya hazırım.`,
      "bot"
    );
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

    const titleMap = {
      dashboard: "Ana Sayfa",
      raporlar: "Kasa Raporları",
      "pos-islemleri": "POS İşlemleri",
      "ozel-odemeler": "Hediye Kartları",
      "nakit-yatirma": "Nakit Yatırma",
      "kasa-duzeltme": "İşlem Kayması Düzeltme",
      "masraf-duzeltme": "Masraf / Fiyat Düzeltme",
      "fatura-portal": "E-Fatura & Portal",
      taksitler: "Taksit Seçenekleri",
      sablon: "Şablon",
      "havale-eft": "Havale / EFT",
      chippin: "Chippin ile Ödeme",
    };

    const pageTitleEl = document.getElementById("pageTitle");
    if (pageTitleEl) {
      pageTitleEl.innerText = titleMap[sectionId] || "Kasa Asistanı";
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
  const responseArea = document.getElementById("llmResponseArea");
  const input = document.getElementById("llmInput");
  const messagesContainer = document.getElementById("chatMessages");

  if (chatWidget) chatWidget.classList.remove("translate-y-[120%]");
  if (floatingBtn) floatingBtn.classList.add("hidden");
  if (responseArea) responseArea.classList.add("hidden");
  if (input) input.value = "";
  if (messagesContainer) {
    messagesContainer.innerHTML = "";
    addChatMessage(
      "Hangi işlemle ilgili yardıma ihtiyacınız var? (Örn: setcard, nakit yatırma, taksit..)",
      "bot"
    );
  }

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
