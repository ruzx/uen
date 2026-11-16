// Home screen: lists every pack from packs/index.json with its modes.
import { h } from './core/dom.js';
import { loadPackIds, loadPack } from './core/packs.js';
import { stars } from './core/storage.js';
import { modes } from './modes/index.js';
import { registerSW, setupInstallButton } from './pwa.js';

const list = document.querySelector('#packs');

async function init() {
  let ids;
  try {
    ids = await loadPackIds();
  } catch (e) {
    list.replaceChildren(h('p', { class: 'error' }, 'Уеннар йөкләнмәде. Сайтны веб-сервер аша ачыгыз (README кара).'));
    return;
  }
  const packs = (await Promise.allSettled(ids.map(loadPack)))
    .filter((r) => r.status === 'fulfilled').map((r) => r.value);

  list.replaceChildren(...packs.map((p) =>
    h('article', { class: 'pack-card' },
      h('a', { class: `pack-cover ${p.settings.imageFit === 'cover' ? 'fit-cover' : ''}`, href: `play.html?pack=${p.id}&mode=${p.modes[0]}`, 'aria-label': p.title },
        p.letter
          ? h('div', { class: 'letter-cover' },
              h('span', { class: 'letter-big' }, p.letter),
              h('div', { class: 'letter-thumbs' }, p.items.slice(0, 4).map((it) => h('img', { src: it.imageUrl, alt: '' }))))
          : h('img', { src: p.coverUrl || p.items[0]?.imageUrl, alt: '' })),
      h('div', { class: 'pack-body' },
        h('h2', {}, p.title),
        p.subtitle ? h('p', { class: 'muted' }, p.subtitle) : null,
        h('div', { class: 'pack-stars' }, `⭐ ${stars.get(p.id)}`),
        h('div', { class: 'btn-row' },
          p.modes.filter((m) => modes[m]).map((m) =>
            h('a', { class: 'btn btn-soft', href: `play.html?pack=${p.id}&mode=${m}` },
              `${modes[m].emoji} ${modes[m].title.tt}`)))))));
}

init();
registerSW();
setupInstallButton(document.querySelector('#btn-install'));
