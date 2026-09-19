/* Ali Usta Baklavaları — çevrimdışı önbellek.
   Kabuk (HTML/CSS/JS/ikon) önbelleğe alınır; ağır medya alınmaz.
   Sürümü değiştirince eski önbellek otomatik silinir. */
var SURUM = 'aliusta-v83';
var KABUK = [
  './',
  './index.html',
  './assets/css/site.css',
  './assets/js/config.js',
  './assets/js/media.js',
  './assets/js/site.js',
  './assets/js/shop.js',
  './assets/js/extras.js',
  './assets/js/fistik.js',
  './assets/js/imlec.js',
  './assets/js/i18n.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/video/poster/hero.webp',
  './manifest.webmanifest'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(SURUM)
      .then(function (c) { return c.addAll(KABUK); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (ks) {
        return Promise.all(ks.filter(function (k) { return k !== SURUM; })
                            .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;

  var u = new URL(r.url);
  if (u.origin !== location.origin) return;                 // CDN ve harita atlanır
  if (/\.(mp4|webm)$/i.test(u.pathname)) return;            // videolar önbelleğe alınmaz

  // HTML: önce ağ, olmazsa önbellek (içerik hep güncel kalsın)
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r).then(function (res) {
        var kopya = res.clone();
        caches.open(SURUM).then(function (c) { c.put('./index.html', kopya); });
        return res;
      }).catch(function () {
        return caches.match('./index.html');
      })
    );
    return;
  }

  // Kod (JS/CSS): önce ağ, olmazsa önbellek. Cache-first olduğunda site
  // güncellendiği hâlde tarayıcıda eski kod çalışmaya devam ediyordu.
  if (/\.(js|css)$/i.test(u.pathname)) {
    e.respondWith(
      fetch(r).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var kopya = res.clone();
          caches.open(SURUM).then(function (c) { c.put(r, kopya); });
        }
        return res;
      }).catch(function () { return caches.match(r); })
    );
    return;
  }

  // Görsel ve diğer varlıklar: önce önbellek, sonra ağ (çevrimdışı hız için)
  e.respondWith(
    caches.match(r).then(function (hit) {
      if (hit) return hit;
      return fetch(r).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var kopya = res.clone();
          caches.open(SURUM).then(function (c) { c.put(r, kopya); });
        }
        return res;
      }).catch(function () { return Response.error(); });
    })
  );
});
