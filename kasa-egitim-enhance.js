/**
 * Kasa Eğitim — ek öğrenme katmanı
 * Mevcut kasa-egitim.html akışını bozmadan: arama, bugünün pratiği,
 * senaryo kartları, QR özeti, yanlış soru tekrarı.
 */
(function () {
  const STORAGE = {
    wrongAnswers: "civilTrainingWrongAnswers",
    practiceDate: "civilTrainingPracticeDate",
    practiceId: "civilTrainingPracticeId",
  };

  const MODULE_META = [
    { id: 1, title: "Hareket Özeti", tags: ["rapor", "kasiyer", "hareket"] },
    { id: 2, title: "Z Raporu", tags: ["z raporu", "gün sonu"] },
    { id: 3, title: "QR Ödeme ve Taksitli Satış", tags: ["qr", "taksit", "pos"] },
    { id: 4, title: "Taksit Kuralları", tags: ["taksit", "world", "albaraka", "vade"] },
    { id: 5, title: "İptal İşlemleri", tags: ["iptal", "qr", "pos"] },
    { id: 6, title: "İade İşlemleri", tags: ["iade", "limit", "qr", "merkez"] },
    { id: 7, title: "Özel Ödeme", tags: ["chippin", "hediye", "yemek"] },
    { id: 8, title: "Havale / EFT", tags: ["havale", "eft", "transfer"] },
    { id: 9, title: "Nakit Yatırma", tags: ["nakit", "tediye", "banka"] },
    { id: 10, title: "Hatalı İşlemler", tags: ["düzeltme", "hata", "kasa"] },
    { id: 11, title: "Şablon & Formüller", tags: ["şablon", "excel", "sheets"] },
  ];

  const SCENARIOS = [
    {
      id: "qr-iptal-ayni-gun",
      title: "Aynı gün QR iptal",
      situation: "Müşteri QR ile ödeme yaptı, ürünü beğenmedi. Z raporu henüz alınmadı.",
      steps: [
        "İptal mi iade mi? → Aynı gün + gün sonu yoksa iptal.",
        "Banka menüsünden QR/Karekod İptal yolunu seç.",
        "Slipteki sıra/işlem bilgisini gir.",
        "Müşteri mobil uygulamasıyla onaylatsın (Axess/BonusFlaş vb.).",
      ],
      module: 5,
      link: "pos-islemleri.html#qrBankProceduresMount",
    },
    {
      id: "iade-limit",
      title: "POS iade limiti aşıldı",
      situation: "POS “İade Limiti Aşıldı” diyor; müşteri bekliyor.",
      steps: [
        "Mağaza limiti artıramaz — Merkez Muhasebe’ye mail.",
        "Fatura, slip, barkodlar ve tutarı ekle.",
        "ztomruk / akurt / ksezgin adreslerine gönder.",
        "Merkez talimatı gelmeden ürünü sistemden iade alma.",
      ],
      module: 6,
      link: "pos-islemleri.html",
    },
    {
      id: "taksit-world",
      title: "Vade farksız 6 taksit",
      situation: "Müşteri World kartıyla 6 taksit istiyor.",
      steps: [
        "Kart World / Albaraka World / Vakıfbank World mu kontrol et.",
        "YKB Business ve World Eko’da vade farksız 6 yok.",
        "POS’ta taksit sayısını seç, çipli kartı tak.",
        "Şüphede Taksitler sayfasındaki listeye bak.",
      ],
      module: 4,
      link: "taksitler.html",
    },
    {
      id: "qr-anlasmasiz",
      title: "Anlaşmasız banka QR",
      situation: "Müşterinin bankası ile QR anlaşmamız yok.",
      steps: [
        "Tutarı gir → 0’a bas → banka seç.",
        "Anlaşma yoksa öncelik Yapı Kredi.",
        "QR ekranını müşteriye göster.",
        "Slip çıkmazsa ek nüsha al.",
      ],
      module: 3,
      link: "pos-islemleri.html",
    },
    {
      id: "havale-kontrol",
      title: "Havale/EFT kontrol",
      situation: "Müşteri havale dekontu gösteriyor.",
      steps: [
        "Havale/EFT ekranını aç.",
        "Banka ve tutarı doğrula.",
        "Dekont/onay ekranını kontrol et.",
        "İşlemi tamamlayıp özeti sakla.",
      ],
      module: 8,
      link: "havale-eft.html",
    },
  ];

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getWrongAnswers() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE.wrongAnswers) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (_) {
      return [];
    }
  }

  function setWrongAnswers(list) {
    localStorage.setItem(STORAGE.wrongAnswers, JSON.stringify(list.slice(0, 30)));
  }

  function daySeed() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  function pickDailyPractice() {
    const today = daySeed();
    if (localStorage.getItem(STORAGE.practiceDate) === today) {
      const saved = localStorage.getItem(STORAGE.practiceId);
      const found = SCENARIOS.find((s) => s.id === saved);
      if (found) {
        return found;
      }
    }
    const index = today.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % SCENARIOS.length;
    const pick = SCENARIOS[index];
    localStorage.setItem(STORAGE.practiceDate, today);
    localStorage.setItem(STORAGE.practiceId, pick.id);
    return pick;
  }

  function renderLearningTools() {
    const mount = document.getElementById("trainingLearningTools");
    if (!mount) {
      return;
    }

    const practice = pickDailyPractice();
    const wrong = getWrongAnswers();

    mount.innerHTML = `
      <div class="training-tools-grid">
        <div class="training-tool-card">
          <div class="training-tool-kicker">Eğitim içi ara</div>
          <div class="page-filter-wrap">
            <i data-lucide="search" class="page-filter-icon"></i>
            <input id="trainingFilterInput" type="search" class="page-filter-input" placeholder="Modül, QR, taksit, iade..." autocomplete="off">
          </div>
          <div class="filter-chip-row mt-3" id="trainingFilterChips">
            <button type="button" class="filter-chip is-active" data-training-filter="">Tümü</button>
            <button type="button" class="filter-chip" data-training-filter="qr">QR</button>
            <button type="button" class="filter-chip" data-training-filter="taksit">Taksit</button>
            <button type="button" class="filter-chip" data-training-filter="iade">İade</button>
            <button type="button" class="filter-chip" data-training-filter="rapor">Rapor</button>
          </div>
        </div>

        <div class="training-tool-card training-practice-card">
          <div class="training-tool-kicker">Bugünün pratiği</div>
          <h3 class="training-tool-title">${escapeHtml(practice.title)}</h3>
          <p class="training-tool-text">${escapeHtml(practice.situation)}</p>
          <ol class="training-practice-steps">
            ${practice.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
          </ol>
          <div class="flex flex-wrap gap-2 mt-3">
            <button type="button" class="smart-action-secondary" onclick="focusModule(${practice.module})">Modül ${practice.module}</button>
            <a href="${escapeHtml(practice.link)}" class="smart-action-secondary">İlgili sayfa</a>
          </div>
        </div>

        <div class="training-tool-card">
          <div class="training-tool-kicker">Yanlışları tekrar et</div>
          <h3 class="training-tool-title">${wrong.length ? `${wrong.length} soru birikmiş` : "Henüz yanlış yok"}</h3>
          <p class="training-tool-text">
            ${
              wrong.length
                ? "Sınavda kaçırdığın soruları kısa bir tekrar setiyle güçlendir."
                : "Sınav sonrası yanlışlar burada toplanır; tekrar ederek pekiştir."
            }
          </p>
          <div class="flex flex-wrap gap-2 mt-3">
            <button type="button" class="smart-action-primary ${wrong.length ? "" : "smart-action-disabled"}" onclick="startWrongAnswerDrill()" ${wrong.length ? "" : "disabled"}>
              Tekrar Başlat
            </button>
            ${
              wrong.length
                ? '<button type="button" class="smart-action-secondary" onclick="clearWrongAnswerDrill()">Temizle</button>'
                : ""
            }
          </div>
        </div>
      </div>

      <div class="training-scenarios mt-4">
        <div class="flex items-center justify-between gap-3 mb-3">
          <div>
            <div class="training-tool-kicker">Hızlı senaryolar</div>
            <h3 class="section-heading text-lg">Kasiyer durumu → doğru adımlar</h3>
          </div>
        </div>
        <div class="training-scenario-grid" id="trainingScenarioGrid"></div>
      </div>

      <div id="trainingBadgeStrip" class="training-badge-strip mt-4"></div>
    `;

    renderScenarios();
    renderBadgeStrip();
    bindTrainingFilter();

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function renderScenarios() {
    const grid = document.getElementById("trainingScenarioGrid");
    if (!grid) {
      return;
    }

    grid.innerHTML = SCENARIOS.map(
      (item) => `
        <button type="button" class="training-scenario-card" data-scenario="${escapeHtml(item.id)}">
          <div class="training-tool-kicker">Senaryo</div>
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.situation)}</p>
          <span class="training-scenario-cta">Adımları gör · Modül ${item.module}</span>
        </button>
      `
    ).join("");

    grid.querySelectorAll("[data-scenario]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = SCENARIOS.find((s) => s.id === btn.getAttribute("data-scenario"));
        if (!item) {
          return;
        }
        showScenarioDetail(item);
      });
    });
  }

  function showScenarioDetail(item) {
    const existing = document.getElementById("scenarioDetailModal");
    if (existing) {
      existing.remove();
    }

    const modal = document.createElement("div");
    modal.id = "scenarioDetailModal";
    modal.className = "certificate-modal active";
    modal.innerHTML = `
      <div class="certificate-content text-left">
        <div class="training-tool-kicker mb-2">Senaryo</div>
        <h3 class="text-xl font-bold mb-2">${escapeHtml(item.title)}</h3>
        <p class="text-sm mb-4" style="color: var(--civil-text-muted, #64748b)">${escapeHtml(item.situation)}</p>
        <ol class="training-practice-steps mb-5">
          ${item.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
        </ol>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="smart-action-primary" onclick="document.getElementById('scenarioDetailModal').remove(); focusModule(${item.module});">Modüle Git</button>
          <a href="${escapeHtml(item.link)}" class="smart-action-secondary">İlgili sayfa</a>
          <button type="button" class="smart-action-secondary" onclick="document.getElementById('scenarioDetailModal').remove()">Kapat</button>
        </div>
      </div>
    `;
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });
    document.body.appendChild(modal);
  }

  function renderBadgeStrip() {
    const strip = document.getElementById("trainingBadgeStrip");
    if (!strip || typeof completedModules === "undefined") {
      return;
    }

    strip.innerHTML = MODULE_META.map((mod) => {
      const done = completedModules.includes(mod.id);
      return `
        <span class="training-module-badge ${done ? "is-done" : ""}" title="${escapeHtml(mod.title)}">
          ${done ? "✓" : mod.id} ${escapeHtml(mod.title)}
        </span>
      `;
    }).join("");
  }

  function bindTrainingFilter() {
    const input = document.getElementById("trainingFilterInput");
    if (input) {
      input.addEventListener("input", () => filterTrainingModules(input.value));
    }

    document.querySelectorAll("[data-training-filter]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const value = chip.getAttribute("data-training-filter") || "";
        document.querySelectorAll("[data-training-filter]").forEach((el) => {
          el.classList.toggle("is-active", el === chip);
        });
        if (input) {
          input.value = value;
        }
        filterTrainingModules(value);
      });
    });
  }

  function filterTrainingModules(query) {
    const normalized = (query || "").trim().toLowerCase();
    document.querySelectorAll(".training-category").forEach((el) => {
      const id = Number(el.getAttribute("data-module"));
      const meta = MODULE_META.find((m) => m.id === id);
      const haystack = [meta?.title, ...(meta?.tags || []), el.innerText]
        .join(" ")
        .toLowerCase();
      const match = !normalized || haystack.includes(normalized);
      el.classList.toggle("training-filtered-out", !match);
    });
  }

  function renderQrTrainingSummaries() {
    const banks = window.QR_BANK_PROCEDURES || [];
    const mounts = [
      { id: "trainingQrSaleMount", mode: "sale" },
      { id: "trainingQrCancelMount", mode: "iptal" },
      { id: "trainingQrRefundMount", mode: "iade" },
    ];

    mounts.forEach(({ id, mode }) => {
      const mount = document.getElementById(id);
      if (!mount || !banks.length) {
        return;
      }

      if (mode === "sale") {
        mount.innerHTML = `
          <div class="training-qr-note">
            <p class="qr-body mb-2">Satış sonrası sorunlarda banka menüleri farklıdır. Aşağıdaki bankalar için iptal/iade prosedürleri POS sayfasında ve Modül 5–6’da özetlenir.</p>
            <div class="filter-chip-row">
              ${banks.map((b) => `<span class="filter-chip is-active">${escapeHtml(b.bank)}</span>`).join("")}
            </div>
            <a href="pos-islemleri.html#qrBankProceduresMount" class="smart-action-secondary mt-3 inline-flex">POS’ta tam prosedürler</a>
          </div>
        `;
        return;
      }

      const cards = banks
        .map((bank) => {
          const ops = (bank.operations || []).filter((op) => op.type === mode).slice(0, 2);
          if (!ops.length) {
            return "";
          }
          return `
            <div class="qr-op-card">
              <h5 class="qr-op-title mb-2">${escapeHtml(bank.bank)}</h5>
              ${ops
                .map(
                  (op) => `
                    <div class="mb-2">
                      <span class="qr-badge ${mode === "iptal" ? "qr-badge-iptal" : "qr-badge-iade"}">${mode === "iptal" ? "İptal" : "İade"}</span>
                      <span class="qr-op-title text-sm ml-1">${escapeHtml(op.title)}</span>
                      <p class="qr-body mt-1"><span class="font-semibold">Menü:</span> ${(op.menuPath || []).map(escapeHtml).join(" › ")}</p>
                    </div>
                  `
                )
                .join("")}
            </div>
          `;
        })
        .filter(Boolean)
        .join("");

      mount.innerHTML = `
        <div class="grid sm:grid-cols-2 gap-3">${cards}</div>
        <a href="pos-islemleri.html#qrBankProceduresMount" class="smart-action-secondary mt-3 inline-flex">Tüm banka adımları</a>
      `;
    });
  }

  window.recordWrongExamAnswers = function recordWrongExamAnswers(questions, answers) {
    const previous = getWrongAnswers();
    const next = [...previous];

    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        return;
      }
      const payload = {
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation || "Doğru seçeneği modül notlarından tekrar et.",
      };
      if (!next.some((item) => item.question === payload.question)) {
        next.unshift(payload);
      }
    });

    setWrongAnswers(next);
    renderLearningTools();
  };

  window.startWrongAnswerDrill = function startWrongAnswerDrill() {
    const wrong = getWrongAnswers();
    if (!wrong.length || typeof showExamModal !== "function") {
      return;
    }

    window.__trainingDrillMode = true;
    window.__trainingDrillQuestions = wrong.slice(0, 8).map((q) => ({
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation,
    }));

    if (typeof prepareExam === "function") {
      // prepareExam override path via flag
    }
    showExamModal();
  };

  window.clearWrongAnswerDrill = function clearWrongAnswerDrill() {
    setWrongAnswers([]);
    renderLearningTools();
    if (typeof showSuccessNotification === "function") {
      showSuccessNotification("Yanlış soru listesi temizlendi.", 2000);
    }
  };

  window.refreshTrainingEnhancements = function refreshTrainingEnhancements() {
    renderBadgeStrip();
    renderLearningTools();
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderLearningTools();
    renderQrTrainingSummaries();

    // completeModule sonrası rozetleri yenile
    const originalComplete = window.completeModule;
    if (typeof originalComplete === "function") {
      window.completeModule = function patchedComplete(moduleNum) {
        originalComplete(moduleNum);
        setTimeout(renderBadgeStrip, 200);
      };
    }
  });
})();
