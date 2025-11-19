self.addEventListener('install', event => {
  console.log('Service worker yüklendi.');
});

self.addEventListener('activate', event => {
  console.log('Service worker aktif.');
});
