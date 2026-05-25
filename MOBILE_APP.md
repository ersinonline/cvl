# Civil Kasa Asistani Mobil Plan

Bu proje icin en guvenli yol "sadece webview" degil, hibrit uygulamadir.

Neden:
- Apple ve Google, sadece web sitesini saran bos uygulamalari reddedebilir.
- Bu proje egitim uygulamasi oldugu icin native fayda gostermek gerekir.

Onerilen fark yaratan ozellikler:
- Cevrimdisi egitim modulleri ve onbellekli rehberler
- Yerel ilerleme takibi ve "kaldigin yerden devam et"
- Sinav sonucu, sertifika ve favori sayfalarin cihazda tutulmasi
- Ileride local notification ile vardiya oncesi mini tekrar hatirlatmasi
- Sertifika PDF paylasimi veya cihazdan yazdirma

Hazirlanan dosyalar:
- `package.json`: Capacitor komutlari
- `capacitor.config.json`: Android/iOS shell ayarlari
- `manifest.json` ve `sw.js`: PWA ve offline temel

Kurulum adimlari:
1. `npm install`
2. `npm run cap:add:android`
3. `npm run cap:add:ios`
4. `npm run cap:sync`
5. `npm run cap:open:android` veya `npm run cap:open:ios`

Android build notu:
- Android debug/release build icin makinede Java 11 veya uzeri JDK kurulu olmalidir.
- Bu ortamda yalnizca Java 8 bulundugu icin Android `assembleDebug` dogrulamasi JDK nedeniyle durmustur.

Magaza uygunlugu icin not:
- Acilis ekraninda uygulamanin amacini net anlatan bir onboarding ekleyin.
- Uygulamaya ozel bir fayda daha ekleyin:
  mini quiz bildirimi, vardiya checklist'i veya offline sertifika arsivi.
- Sadece siteyi gosteren bir kap yerine, cihazda saklanan egitim deneyimi oldugunu acikca belli edin.
