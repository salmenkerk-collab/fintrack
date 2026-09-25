// IMPORTANT: bump CACHE_VERSION on every deploy to force the PWA to fetch the new index.html.
// Otherwise users see the old cached version forever.
const CACHE_VERSION = 'finance-v44-fi-accuracy';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

// Third-party libraries and fonts the app needs to boot. Cached on first use so the
// app also opens offline. Anything else (Firebase sync, price and FX APIs) always
// goes straight to the network and is never cached.
const RUNTIME_HOSTS = [
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'www.gstatic.com',        // Firebase SDK scripts (not the Firestore API itself)
];

// Pre-cache the exact library URLs index.html loads, so offline works from the first
// install (not only after a second visit). Best effort: a failure here never blocks install.
const LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.28.4/babel.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prop-types/15.8.1/prop-types.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/recharts/2.12.7/Recharts.min.js',
];
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Hanken+Grotesk:wght@400;500;600&display=swap';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_VERSION).then(c =>
    c.addAll(ASSETS).then(() => Promise.all(
      LIBS.map(u => c.add(new Request(u, { mode:'cors' })).catch(() => {}))
        .concat([c.add(new Request(FONT_CSS, { mode:'cors' })).catch(() => {})])
    ))
  ));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Delete any old caches that don't match the current version
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Same origin: network-first for the page (so updates land quickly), cache-first for the rest
  if (url.origin === self.location.origin){
    const isPage = e.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
    if (isPage){
      e.respondWith(
        fetch(e.request).then(r => {
          const copy = r.clone();
          caches.open(CACHE_VERSION).then(c => c.put('./index.html', copy));
          return r;
        }).catch(() => caches.match('./index.html'))
      );
    } else {
      e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
    }
    return;
  }

  // Pinned CDN libraries + fonts: cache-first, filled on first use
  if (RUNTIME_HOSTS.indexOf(url.hostname) !== -1){
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
        if (r && (r.ok || r.type === 'opaque')){
          const copy = r.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, copy));
        }
        return r;
      }))
    );
  }
  // everything else: default browser handling (network)
});
