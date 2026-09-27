/**
 * Banka QR (Karekod) Ödeme İptal / İade prosedürleri.
 * Kaynak: banka POS kılavuzları + mağaza operasyon notları.
 *
 * merchantPasswordGuideDefault: Banka dokümanında geçen işyeri şifresi örneği.
 * Üretimde değişmiş olabilir; mağaza yöneticisinden doğrulanmalıdır.
 */
const QR_BANK_PROCEDURES = [
  {
    id: "akbank",
    bank: "Akbank",
    aliases: ["akbank", "axess", "karekod", "fast"],
    supportPhone: "444 28 28",
    notes: [
      "İptal: gün sonu alınmadan önce; iade: gün sonu sonrası veya referanslı iade.",
      "Axess Mobil ile müşteri onayı gerekir (klasik Karekod İptal/İade akışı).",
      "FAST referanslı iadede müşteri QR okutmaz; slipteki 16 haneli işlem kodu kullanılır.",
    ],
    images: [
      {
        src: "assets/qr-procedures/akbank-menu.jpg",
        alt: "Akbank POS ana menü — Kart İşleri",
      },
      {
        src: "assets/qr-procedures/akbank-kart-islemleri.jpg",
        alt: "Akbank Kart İşlemleri — Karekod İade / İptal menüleri",
      },
    ],
    operations: [
      {
        type: "iptal",
        title: "Karekod İptal",
        menuPath: ["Akbank Menü", "Kart İşlemleri / Kart İşleri", "Karekod İptal"],
        requiredFields: [
          { key: "siraNo", label: "Sıra no", source: "Orijinal işlem slipi" },
        ],
        requiresMerchantPassword: false,
        steps: [
          "POS ana menüden Kart İşlemleri (Kart İşleri) seçin.",
          "Karekod İptal seçeneğine girin.",
          "Slipteki sıra numarasını girip Giriş'e basın.",
          "POS'ta QR görünür; müşteri Axess Mobil ile QR'ı okutur ve onaylar.",
        ],
      },
      {
        type: "iade",
        title: "Karekod İade",
        menuPath: ["Akbank Menü", "Kart İşlemleri / Kart İşleri", "Karekod İade"],
        requiredFields: [
          { key: "merchantPassword", label: "Kullanıcı / işyeri şifresi", source: "Mağaza yöneticisi" },
          { key: "islemKodu", label: "İşlem kodu", source: "Orijinal işlem slipi" },
          { key: "tutar", label: "İade tutarı", source: "İade edilecek tutar" },
        ],
        requiresMerchantPassword: true,
        merchantPasswordGuideDefault: "4321",
        steps: [
          "POS ana menüden Kart İşlemleri seçin.",
          "Karekod İade seçeneğine girin.",
          "İşyeri / kullanıcı şifresini girin (mağaza yöneticisinden doğrulayın).",
          "Slipteki işlem kodunu girin.",
          "İade tutarını girin.",
          "POS'ta QR görünür; müşteri Axess Mobil ile okutup onaylar.",
        ],
      },
      {
        type: "iade",
        title: "Karekod FAST / FAST Referanslı İade",
        menuPath: [
          "Akbank Menü",
          "Kart İşlemleri / Kart İşleri",
          "Karekod FAST İade veya FAST Referanslı İade",
        ],
        requiredFields: [
          { key: "merchantPassword", label: "İşyeri şifresi", source: "Mağaza yöneticisi" },
          { key: "tutar", label: "İade tutarı", source: "İade edilecek tutar" },
          {
            key: "islemKodu16",
            label: "16 haneli işlem kodu",
            source: "Onaylı işlem slipi",
          },
        ],
        requiresMerchantPassword: true,
        merchantPasswordGuideDefault: "4321",
        preferredForFast: true,
        steps: [
          "Kart İşlemleri menüsüne girin.",
          "Karekod FAST Referanslı İade (veya Karekod FAST İade) seçin.",
          "Kart iadesiyle aynı akışa devam edin.",
          "İşyeri şifresini girin (mağaza yöneticisinden doğrulayın).",
          "İade tutarını girin.",
          "Slipteki 16 haneli işlem kodunu girin.",
          "Sorun olursa Akbank destek: 444 28 28.",
        ],
      },
    ],
  },
  {
    id: "finansbank",
    bank: "QNB Finansbank",
    aliases: ["finansbank", "qnb", "qnb finansbank"],
    supportPhone: "0850 222 1 900",
    notes: [
      "Karekod iptal/iade yalnızca satış da karekod ile yapılmışsa mümkündür.",
      "Menü onayı için Giriş tuşu kullanılır; ana menü için modele göre F / Menü / ALPHA.",
      "İlk kurulum işyeri şifresi banka kılavuzunda 0000 olarak geçer; değişmişse mağazadan sorun.",
    ],
    images: [],
    operations: [
      {
        type: "iptal",
        title: "Karekod İptal",
        menuPath: ["Ana menü", "İptal"],
        requiredFields: [
          { key: "merchantPassword", label: "İşyeri şifresi", source: "Mağaza yöneticisi" },
          { key: "islemSiraNo", label: "İşlem sıra no", source: "POS slipi" },
        ],
        requiresMerchantPassword: true,
        merchantPasswordGuideDefault: "0000",
        steps: [
          "Ana menüden İptal seçin.",
          "İşyeri şifresini girin.",
          "Slipteki İşlem Sıra No'yu girin.",
          "Karekod iptal için 0 tuşuna basın (kart okutmayın).",
        ],
      },
      {
        type: "iade",
        title: "Peşin Satış İade (Karekod)",
        menuPath: ["Ana menü", "İade İşlemleri", "İade"],
        requiredFields: [
          { key: "merchantPassword", label: "İşyeri şifresi", source: "Mağaza yöneticisi" },
          { key: "tutar", label: "İade tutarı", source: "İade edilecek tutar" },
          { key: "satisTutari", label: "Orijinal satış tutarı", source: "Satış slipi" },
          { key: "tarih", label: "Satış tarihi (GGAAYYYY)", source: "Satış slipi" },
        ],
        requiresMerchantPassword: true,
        merchantPasswordGuideDefault: "0000",
        steps: [
          "Ana menüden İade İşlemleri > İade seçin.",
          "İşyeri şifresini girin.",
          "İade tutarını girip Giriş'e basın.",
          "Karekod iade için 0 tuşuna basın.",
          "Orijinal satış tutarını ve satış tarihini (GGAAYYYY) girin.",
        ],
      },
      {
        type: "iade",
        title: "Taksitli Satış İade (Karekod)",
        menuPath: ["Ana menü", "İade İşlemleri", "Taksitli satış iade"],
        requiredFields: [
          { key: "merchantPassword", label: "İşyeri şifresi", source: "Mağaza yöneticisi" },
          { key: "tutar", label: "İade tutarı", source: "İade edilecek tutar" },
          { key: "satisTutari", label: "Orijinal satış tutarı", source: "Satış slipi" },
          { key: "tarih", label: "Satış tarihi (GGAAYYYY)", source: "Satış slipi" },
          { key: "taksit", label: "Taksit sayısı", source: "Satış slipi" },
        ],
        requiresMerchantPassword: true,
        merchantPasswordGuideDefault: "0000",
        steps: [
          "Ana menüden İade İşlemleri > Taksitli satış iade seçin.",
          "İşyeri şifresini girin.",
          "İade tutarını girin; karekod için 0 tuşuna basın.",
          "Satış tutarı, satış tarihi (GGAAYYYY) ve taksit sayısını girin.",
        ],
      },
    ],
  },
  {
    id: "garanti",
    bank: "Garanti BBVA",
    aliases: ["garanti", "garanti bbva", "bonusflas", "bonus"],
    supportPhone: null,
    notes: [
      "Ortak POS'ta F ile banka seçilir; ardından Özel İşlemler > QR Kod ile Ödeme.",
      "İptalde işlem/sıra numarası; iadede referans numarası (slipte Ref. No) girilir.",
      "Müşteri BonusFlaş ile QR okutup onayladıktan sonra POS'ta Giriş'e basılır.",
    ],
    images: [],
    operations: [
      {
        type: "iptal",
        title: "QR Kod ile İptal",
        menuPath: ["F", "Özel İşlemler", "QR Kod ile Ödeme", "QR Kod ile İptal"],
        requiredFields: [
          { key: "merchantPassword", label: "İptal/iade şifresi", source: "Mağaza yöneticisi" },
          {
            key: "islemNo",
            label: "İşlem / sıra numarası",
            source: "POS slipi (iptalde son işlem otomatik gelebilir)",
          },
        ],
        requiresMerchantPassword: true,
        merchantPasswordGuideDefault: null,
        steps: [
          "F tuşuna basın; Özel İşlemler menüsünü seçin.",
          "QR Kod ile Ödeme > QR Kod ile İptal seçin.",
          "İptal/iade şifresini girin.",
          "İptal edilecek işlemin numarasını / sıra numarasını girin (farklı işlemse slipten değiştirin).",
          "QR ekranda görünür; müşteri BonusFlaş ile okutup onaylar, ardından Giriş'e basın.",
        ],
      },
      {
        type: "iade",
        title: "QR Kod ile İade",
        menuPath: ["F", "Özel İşlemler", "QR Kod ile Ödeme", "QR Kod ile İade"],
        requiredFields: [
          { key: "merchantPassword", label: "İptal/iade şifresi", source: "Mağaza yöneticisi" },
          {
            key: "referansNo",
            label: "Referans numarası",
            source: "POS slipi (Ref. No)",
          },
        ],
        requiresMerchantPassword: true,
        merchantPasswordGuideDefault: null,
        steps: [
          "F tuşuna basın; Özel İşlemler > QR Kod ile Ödeme seçin.",
          "QR Kod ile İade seçin.",
          "İptal/iade şifresini girin.",
          "Slipteki referans numarasını girin.",
          "QR ekranda görünür; müşteri BonusFlaş ile okutup onaylar, ardından Giriş'e basın.",
        ],
      },
    ],
  },
  {
    id: "isbankasi",
    bank: "Türkiye İş Bankası",
    aliases: ["iş bankası", "is bankasi", "işbank", "isbank"],
    supportPhone: "0850 724 77 67",
    supportEmail: "otorizasyon@isbank.com.tr",
    notes: [
      "Tüm QR işlemleri MENÜ > QR Ödeme İşlemleri altındadır.",
      "Peşin ve taksitli iade ayrı menü seçenekleridir; ayrı bir 'iptal' menü satırı yoktur.",
      "Müşteri QR'ı telefonuna okutup onayladıktan sonra POS'ta Giriş'e basılır.",
    ],
    images: [],
    operations: [
      {
        type: "iade",
        title: "Peşin İade",
        menuPath: ["Menü", "QR Ödeme İşlemleri", "Peşin İade"],
        requiredFields: [
          { key: "merchantPassword", label: "İşyeri şifresi", source: "Mağaza yöneticisi" },
          { key: "tutar", label: "İade tutarı", source: "İade edilecek tutar" },
          { key: "referansNo", label: "Referans no", source: "POS slipi" },
        ],
        requiresMerchantPassword: true,
        merchantPasswordGuideDefault: "1234",
        steps: [
          "Menü'ye girip QR Ödeme İşlemleri'ni seçin.",
          "Peşin İade seçin.",
          "İşyeri şifresini girin (mağaza yöneticisinden doğrulayın).",
          "İade tutarını girin.",
          "Slipteki referans numarasını girin.",
          "Görünen QR'ı müşteri okutup onaylar; POS'ta Giriş'e basın.",
        ],
      },
      {
        type: "iade",
        title: "Taksitli İade",
        menuPath: ["Menü", "QR Ödeme İşlemleri", "Taksitli İade"],
        requiredFields: [
          { key: "merchantPassword", label: "İşyeri şifresi", source: "Mağaza yöneticisi" },
          { key: "tutar", label: "İade tutarı", source: "İade edilecek tutar" },
          { key: "referansNo", label: "Referans no", source: "POS slipi" },
        ],
        requiresMerchantPassword: true,
        merchantPasswordGuideDefault: "1234",
        steps: [
          "Menü > QR Ödeme İşlemleri > Taksitli İade seçin.",
          "İşyeri şifresini girin.",
          "İade tutarını ve slipteki referans numarasını girin.",
          "Müşteri QR'ı okutup onayladıktan sonra POS'ta Giriş'e basın.",
        ],
      },
    ],
  },
];

if (typeof window !== "undefined") {
  window.QR_BANK_PROCEDURES = QR_BANK_PROCEDURES;
}
