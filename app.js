    <script>
        // İkonları Yükle
        lucide.createIcons();
        
        // Bu fonksiyon, mevcut HTML kılavuz metnini LLM'e bağlam için çeker.
        function getFullContextText() {
            let context = "";
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => {
                const title = section.querySelector('h2');
                if (title) {
                    context += `\n--- BÖLÜM: ${title.textContent.trim()} ---\n`;
                }
                section.querySelectorAll('.step-container').forEach(step => {
                    const stepTitle = step.querySelector('.step-title');
                    const stepContent = step.querySelector('.step-content p');
                    if (stepTitle && stepContent) {
                        // Not: HTML içeriği textContent ile çektiğimiz için <b class="font-semibold"> etiketi düz metin olarak geliyor.
                        // Bu düz metin formatı LLM'e yeterli bağlamı sağlar.
                        context += `- ${stepTitle.textContent.trim()}: ${stepContent.textContent.trim()}\n`;
                    }
                });
            });
            // Taksit kurallarını ekle (kart görselleri hariç)
            const taksitSection = document.getElementById('taksitler');
            if (taksitSection) {
                context += "\n--- EK KURALLAR: TAKSİT SEÇENEKLERİ ---\n";
                taksitSection.querySelectorAll('ul.list-disc li').forEach(li => {
                    context += `- ${li.textContent.trim()}\n`;
                });
                taksitSection.querySelectorAll('h3').forEach(h3 => {
                    // Sadece başlığın metnini ekliyoruz
                    context += `- Kural: ${h3.textContent.trim()}\n`;
                });
            }

            return context;
        }

        // ===== Basit Anahtar Kelimeye Göre Yönlendirme Fonksiyonu =====
        function navigateByKeyword(query) {
            query = query.toLowerCase();
                const keywordMap = {
                    'pos': 'pos-islemleri',
                    'iade': 'pos-islemleri',
                    'iptal': 'pos-islemleri',
                    'taksit': 'taksitler',
                    'vade': 'taksitler',
                    'chippin': 'chippin',
                    'setcard': 'ozel-odemeler',
                    'hediye': 'ozel-odemeler',
                    'hediye kartı': 'ozel-odemeler',
                    'iwallet': 'ozel-odemeler',
                    'ederned': 'ozel-odemeler',
                    'nakit': 'nakit-yatirma',
                    'nakit yatırma': 'nakit-yatirma',
                    'kasa hatası': 'kasa-duzeltme',
                    'işlem kayması': 'kasa-duzeltme',
                    'kayma': 'kasa-duzeltme',
                    'masraf': 'masraf-duzeltme',
                    'fiyat hatası': 'masraf-duzeltme',
                    'fatura': 'fatura-portal',
                    'portal': 'fatura-portal',
                    'online': 'fatura-portal',
                    'alışveriş': 'fatura-portal',
                    'rapor': 'raporlar'
                };

            for (const [keyword, sectionId] of Object.entries(keywordMap)) {
                if (query.includes(keyword)) {
                    return sectionId;
                }
            }
            return null;
        }

        async function handleChatRequest(e) {
            e.preventDefault();
            const input = document.getElementById('llmInput');
            const responseArea = document.getElementById('llmResponseArea');
            const userText = input.value.trim();

            if (!userText) {
                responseArea.textContent = "Lütfen bir anahtar kelime veya soru girin.";
                responseArea.classList.remove('hidden');
                return;
            }
            
            // Kullanıcı mesajını chat kutusuna ekle
            addChatMessage(userText, 'user');
            input.value = '';

            const targetSectionId = navigateByKeyword(userText);

            if (targetSectionId) {
                showSection(targetSectionId);
                addChatMessage(
                    `"${userText}" anahtar kelimesi ile ilgili olarak sizi "${document.getElementById('pageTitle').innerText}" bölümüne yönlendiriyorum.`,
                    'bot'
                );

                // ✅ Yönlendirme başarılıysa chat kutusunu kapat
                closeChat();
            } else {
                // ❌ Sayfa bulunamadığında chat açık kalmaya devam ediyor
                addChatMessage(
                    `"${userText}" için özel bir sayfa bulunamadı, ancak yardımcı olmaya hazırım.`,
                    'bot'
                );
            }


        }

        function addChatMessage(text, sender) {
            const messagesContainer = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            const messageSpan = document.createElement('span');
            
            messageDiv.className = `message mb-2 ${sender === 'user' ? 'text-right' : 'text-left'}`;
            
            messageSpan.className = `inline-block p-2 rounded-lg max-w-[85%] ${
                sender === 'user' ? 'bg-civil-red text-white' : 'bg-slate-200 text-slate-800'
            }`;
            messageSpan.textContent = text;
            
            messageDiv.appendChild(messageSpan);
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight; // En alta kaydır
        }
        
        // Formun gönderilme olayını yakalamak için
        document.querySelector('#chatWidget form').onsubmit = handleChatRequest;

        // ===== Navigasyon & Arayüz Fonksiyonları (Önceki Sürümden korunmuştur) =====

        function showSection(sectionId) {
            if (window.innerWidth < 1024) {
                document.getElementById('sidebar').classList.add('-translate-x-full');
                document.getElementById('mobileOverlay').classList.add('hidden');
            }
            document.querySelectorAll('.content-section').forEach(el => {
                el.classList.add('hidden');
                el.classList.remove('block');
            });
            const target = document.getElementById(sectionId);
            if (target) {
                target.classList.remove('hidden');
                target.classList.add('block');
                
                const titleMap = {
                    'dashboard': 'Ana Sayfa',
                    'raporlar': 'Kasa Raporları',
                    'pos-islemleri': 'POS İşlemleri',
                    'ozel-odemeler': 'Hediye Kartları',
                    'nakit-yatirma': 'Nakit Yatırma',
                    'kasa-duzeltme': 'İşlem Kayması Düzeltme',
                    'masraf-duzeltme': 'Masraf / Fiyat Düzeltme',
                    'fatura-portal': 'E-Fatura & Portal',
                    'taksitler': 'Taksit Seçenekleri',
                    'sablon': 'Şablon',
                    'havale-eft': 'Havale / EFT',
                     'chippin': 'Chippin ile Ödeme',
                };
                document.getElementById('pageTitle').innerText = titleMap[sectionId] || 'Kasa Asistanı';
            }
            document.querySelectorAll('.nav-item').forEach(btn => {
                if(btn.dataset.target === sectionId) {
                    btn.classList.add('bg-civil-light', 'text-civil-red');
                    btn.classList.remove('text-slate-600');
                } else {
                    btn.classList.remove('bg-civil-light', 'text-civil-red');
                    btn.classList.add('text-slate-600');
                }
            });
            document.getElementById('contentArea').scrollTo(0,0);
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('mobileOverlay');
            
            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }

        function handleSearch(query) {
            query = query.toLowerCase();
            const searchItems = document.querySelectorAll('.step-container'); // Sadece step-containerları arıyoruz
            
            if (query.length > 2) {
                document.querySelectorAll('.content-section').forEach(sec => {
                    sec.classList.add('hidden');
                    sec.classList.remove('block');
                });
                document.getElementById('dashboard').classList.add('hidden');
                document.getElementById('mobileTitle').innerText = "Arama Sonuçları";
                document.getElementById('pageTitle').innerText = "Arama Sonuçları";

                searchItems.forEach(item => {
                    if (item.innerText.toLowerCase().includes(query)) {
                        item.classList.remove('hidden');
                        item.closest('.content-section').classList.remove('hidden');
                        item.closest('.content-section').classList.add('block');
                    } else {
                        item.classList.add('hidden');
                    }
                });

                document.querySelectorAll('.content-section').forEach(sec => {
                    const visibleItems = sec.querySelectorAll('.step-container:not(.hidden)').length;
                    if (visibleItems === 0) {
                        sec.classList.add('hidden');
                    }
                });

            } else if (query.length === 0) {
                showSection('dashboard');
                document.getElementById('mobileTitle').innerText = "Kasa Yardımcım";
                searchItems.forEach(item => item.classList.remove('hidden'));
            }
        }

        function copyToClipboard(elementId) {
            const el = document.getElementById(elementId);
            el.select();
            document.execCommand('copy');
            
            const btn = el.nextElementSibling;
            const originalText = btn.innerText;
            btn.innerText = "Kopyalandı!";
            btn.classList.add('text-green-600', 'bg-green-50');
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.remove('text-green-600', 'bg-green-50');
            }, 2000);
        }

        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            input.type = input.type === 'password' ? 'text' : 'password';
        }

        function openModal(src) {
            const modal = document.getElementById('imageModal');
            const img = document.getElementById('modalImage');
            img.src = src;
            modal.classList.remove('hidden');
            setTimeout(() => img.classList.remove('scale-95'), 10);
        }

        function closeModal() {
            const modal = document.getElementById('imageModal');
            const img = document.getElementById('modalImage');
            img.classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 200);
        }
        
        function openChat() {
            document.getElementById('chatWidget').classList.remove('translate-y-[120%]');
            document.getElementById('floatingChatButton').classList.add('hidden');
            // Akıllı Asistan açıldığında içerik temizlenmeli ve sadece rehberlik modu aktif olmalı
            document.getElementById('llmResponseArea').classList.add('hidden');
            document.getElementById('llmInput').value = '';
            
            // Kullanıcıya rehberlik mesajı göster
            const messagesContainer = document.getElementById('chatMessages');
            messagesContainer.innerHTML = ''; // Önceki mesajları temizle
            addChatMessage('Hangi işlemle ilgili yardıma ihtiyacınız var? (Örn: setcard, nakit yatırma, taksit..)', 'bot');

            if (window.innerWidth < 1024) {
                document.getElementById('sidebar').classList.add('-translate-x-full');
                document.getElementById('mobileOverlay').classList.add('hidden');
            }
        }

        function closeChat() {
            document.getElementById('chatWidget').classList.add('translate-y-[120%]');
            document.getElementById('floatingChatButton').classList.remove('hidden');
        }

        // Başlangıçta Ana Sayfayı Göster
        window.onload = () => {
            showSection('dashboard');
        };
      
      document.getElementById("llmInput").addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            document.querySelector("#chatWidget form").dispatchEvent(new Event("submit"));
        }
    });


    </script>


    <script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
        .then(() => console.log("Service worker başarıyla yüklendi"))
        .catch(err => console.log("SW hatası:", err));
    }
    </script>

    <script>
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js")
        .then(() => console.log("Service Worker aktif (offline mod hazır)."))
        .catch(err => console.log("Service Worker hatası:", err));
    }
    </script>
