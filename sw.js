// Service worker: makes the whole site (all packs, pictures and recordings) work offline.
// Bump VERSION when you publish changes so devices pick them up quickly.
const VERSION = 'uen-v3';

const SHELL = [
  './', 'index.html', 'play.html', 'manifest.webmanifest', 'css/style.css',
  'js/hub.js', 'js/play.js', 'js/pwa.js',
  'js/core/dom.js', 'js/core/storage.js', 'js/core/packs.js', 'js/core/audio.js', 'js/core/fx.js', 'js/core/widgets.js',
  'js/modes/index.js', 'js/modes/learn.js', 'js/modes/quiz.js', 'js/modes/loto.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'packs/index.json',
];

async function precacheAll() {
  const cache = await caches.open(VERSION);
  await Promise.allSettled(SHELL.map((u) => cache.add(u)));
  // Pre-cache every pack: pack.json + images + audio (missing audio is fine).
  try {
    const { packs } = await (await fetch('packs/index.json', { cache: 'no-cache' })).json();
    await Promise.allSettled(packs.map(async (id) => {
      const base = `packs/${id}/`;
      const pack = await (await fetch(base + 'pack.json', { cache: 'no-cache' })).json();
      const urls = [base + 'pack.json'];
      if (pack.cover) urls.push(base + pack.cover);
      for (const it of pack.items || []) {
        if (it.image) urls.push(base + it.image);
        if (it.audio) urls.push(base + it.audio);
      }
      await Promise.allSettled([...new Set(urls)].map((u) => cache.add(u)));
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

// Stale-while-revalidate for same-origin GETs: instant from cache, refreshed in background.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.headers.has('range')) return; // media range requests: let the browser handle them
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const cached = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
    const network = fetch(req).then((res) => {
      if (res.ok && res.status === 200) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { e.waitUntil(network); return cached; }
    return (await network) || new Response('Offline', { status: 503 });
  })());
});
