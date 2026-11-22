// Service worker: makes the whole site (all packs, pictures and recordings) work offline.
//
// Strategy:
//  - code & data (html, js, css, json): NETWORK FIRST, cache only as offline fallback
//    → online users always get a consistent, current set of files (no old/new mix).
//  - media (images, audio, fonts): CACHE FIRST, refreshed in the background.
// All network requests bypass the browser HTTP cache (GitHub Pages caches for 10 min),
// otherwise stale copies could be stored.
//
// Bump VERSION when you publish changes so media is re-downloaded.
const VERSION = 'uen-v6';

const SHELL = [
  './', 'index.html', 'play.html', 'manifest.webmanifest', 'css/style.css',
  'js/hub.js', 'js/play.js', 'js/pwa.js',
  'js/core/dom.js', 'js/core/storage.js', 'js/core/packs.js', 'js/core/audio.js', 'js/core/fx.js', 'js/core/widgets.js',
  'js/modes/index.js', 'js/modes/learn.js', 'js/modes/quiz.js', 'js/modes/loto.js', 'js/modes/memory.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'packs/index.json',
];

const fresh = (url) => fetch(new Request(url, { cache: 'reload' }));

async function addFresh(cache, url) {
  const res = await fresh(url);
  if (res.ok) await cache.put(url, res);
}

async function precacheAll() {
  const cache = await caches.open(VERSION);
  await Promise.allSettled(SHELL.map((u) => addFresh(cache, u)));
  // Pre-cache every pack: pack.json + images + audio (missing audio is fine).
  try {
    const { packs } = await (await fresh('packs/index.json')).json();
    await Promise.allSettled(packs.map(async (id) => {
      const base = `packs/${id}/`;
      const pack = await (await fresh(base + 'pack.json')).json();
      const urls = [base + 'pack.json'];
      if (pack.cover) urls.push(base + pack.cover);
      for (const it of pack.items || []) {
        if (it.image) urls.push(base + it.image);
        if (it.audio) urls.push(base + it.audio);
      }
      await Promise.allSettled([...new Set(urls)].map((u) => addFresh(cache, u)));
    }));
  } catch { /* offline during install – runtime caching will fill in */ }
}

self.addEventListener('install', (e) => {
  e.waitUntil(precacheAll().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

const isMedia = (url) => /\.(webp|png|jpe?g|svg|gif|wav|mp3|ogg|m4a|woff2?)$/i.test(url.pathname);

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (req.headers.has('range')) return; // media range requests: let the browser handle them

  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const fromNet = () => fetch(req, { cache: 'no-cache' }).then((res) => {
      if (res.ok && res.status === 200) cache.put(req, res.clone());
      return res;
    });

    if (isMedia(url)) {
      const cached = await cache.match(req);
      if (cached) { e.waitUntil(fromNet().catch(() => {})); return cached; }
      return fromNet().catch(() => new Response('', { status: 504 }));
    }

    // code / data: network first
    try {
      return await fromNet();
    } catch {
      const cached = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
      return cached || new Response('Offline', { status: 503 });
    }
  })());
});
