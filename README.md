# Civil Kasa Asistani

Civil'de yeni baslayan kasacilar icin hazirlanmis egitim ve operasyon destek uygulamasi.

## Icerik

- Kasa islemleri icin rehber sayfalari
- Modullu kasa egitimi
- Sinav ve sertifika akisi
- Hizli arama ve favori sayfalar
- Kaldigin yerden devam et deneyimi
- Cevrimdisi kullanima uygun PWA altyapisi
- Android ve iOS hibrit uygulama hazirligi

## Yeni eklenen gelistirmeler

- Global hizli arama paneli
- Sol menude favori sayfa sistemi
- Dashboard'da akilli devam kartlari
- Egitim modullerinde son kalinan adimin tutulmasi
- Egitim ilerlemesini sifirlama aksiyonu
- Gercek service worker cache yapisi
- Manifest kisayollari
- Capacitor tabanli mobil paketleme hazirligi

## Yerel calistirma

```bash
node server.js
```

Uygulama varsayilan olarak `http://localhost:8080` adresinde acilir.

## Mobil uygulama hazirligi

Detayli notlar icin [MOBILE_APP.md](/Users/ersin/Downloads/cvl-main/MOBILE_APP.md:1) dosyasina bakin.

Temel kurulum:

```bash
npm install
npm run cap:add:android
npm run cap:add:ios
npm run cap:sync
```

## Magaza uyumlulugu notu

Apple App Store ve Google Play icin sadece bir web sitesini saran bos webview yerine:

- cevrimdisi egitim
- yerel ilerleme takibi
- sertifika akisi
- favori ve hizli erisim

gibi cihaza ozel faydalar sunan hibrit deneyim hedeflenmistir.
