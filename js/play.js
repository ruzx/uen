// Game shell: loads a pack + mode from the URL (?pack=heroes&mode=quiz),
// owns the header (stars, sound, RU toggle), progress dots, start & finish screens.
import { h } from './core/dom.js';
import { loadPack } from './core/packs.js';
import * as audio from './core/audio.js';
import { getSettings, saveSettings, stars } from './core/storage.js';
import { flyStar } from './core/fx.js';
import { icon } from './core/widgets.js';
import { modes } from './modes/index.js';
import { registerSW } from './pwa.js';

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const packId = params.get('pack') || 'heroes';
let modeId = params.get('mode') || 'quiz';

const els = {
  title: $('#pack-title'), sub: $('#pack-sub'), stars: $('#stars-count'), starsBox: $('#stars'),
  mute: $('#btn-mute'), ru: $('#btn-ru'), dots: $('#dots'), stage: $('#stage'), overlay: $('#overlay'),
};

let pack;
let cleanup = null;
let settings = getSettings();

function refreshToggles() {
  els.mute.replaceChildren(icon(settings.muted ? 'mute' : 'speaker'));
  els.mute.setAttribute('aria-pressed', String(!settings.muted));
  els.ru.classList.toggle('off', !settings.showRu);
  els.ru.setAttribute('aria-pressed', String(settings.showRu));
}

els.mute.addEventListener('click', () => {
  settings = { ...settings, muted: !settings.muted };
  saveSettings(settings);
  if (settings.muted) audio.stopVoice();
  refreshToggles();
});
els.ru.addEventListener('click', () => {
  settings = { ...settings, showRu: !settings.showRu };
  saveSettings(settings);
  refreshToggles();
  document.querySelectorAll('.phrase-ru').forEach((e) => e.toggleAttribute('hidden', !settings.showRu));
});

const ui = {
  speak: (item) => audio.speak(item),
  progress(i, n) {
    els.dots.replaceChildren(...Array.from({ length: n }, (_, k) =>
      h('span', { class: `dot ${k < i ? 'done' : ''} ${k === i ? 'now' : ''}` })));
  },
  addStar(fromEl) {
    flyStar(fromEl, els.starsBox).then(() => {
      audio.sfx.star();
      els.stars.textContent = stars.add(pack.id);
      els.starsBox.classList.remove('pop');
      void els.starsBox.offsetWidth;
      els.starsBox.classList.add('pop');
    });
  },
};

function showOverlay(...children) {
  els.overlay.replaceChildren(h('div', { class: 'overlay-card' }, ...children));
  els.overlay.hidden = false;
}

function modeButtons(exceptId) {
  return pack.modes.filter((m) => m !== exceptId && modes[m]).map((m) =>
    h('button', { class: 'btn btn-soft', type: 'button', onclick: () => switchMode(m) },
      `${modes[m].emoji} ${modes[m].title.tt}`));
}

function switchMode(m) {
  modeId = m;
  history.replaceState(null, '', `?pack=${pack.id}&mode=${m}`);
  run();
}

function showStart() {
  const mode = modes[modeId];
  showOverlay(
    pack.letter ? h('div', { class: 'overlay-letter bob' }, pack.letter)
      : pack.coverUrl ? h('img', { class: 'overlay-img bob', src: pack.coverUrl, alt: '' }) : null,
    h('h2', {}, pack.title),
    h('p', { class: 'muted' }, `${mode.emoji} ${mode.title.tt} · ${mode.title.ru}`),
    h('button', { class: 'btn btn-play', type: 'button', 'aria-label': 'Башлау', onclick: () => { audio.unlock(); run(); } }, icon('play')),
  );
}

function finish(result) {
  audio.sfx.win();
  const starsRow = result.learn
    ? h('div', { class: 'big-emoji' }, '🎉')
    : h('div', { class: 'result-stars' }, Array.from({ length: result.total }, (_, k) =>
        h('span', { class: k < result.stars ? 'on' : 'off', style: { animationDelay: `${k * 0.12}s` } }, '⭐')));
  const praise = result.learn || result.stars >= result.total - 1 ? 'Афәрин!' : 'Булдырдың!';
  showOverlay(
    h('h2', { class: 'praise' }, praise),
    starsRow,
    h('div', { class: 'btn-row' },
      h('button', { class: 'btn btn-main', type: 'button', onclick: run }, icon('replay'), ' Тагын'),
      ...modeButtons(modeId),
      h('a', { class: 'btn btn-soft', href: './' }, icon('home'))),
  );
}

function run() {
  cleanup?.();
  audio.stopVoice();
  els.overlay.hidden = true;
  const mode = modes[modeId];
  try {
    cleanup = mode.start({ pack, stage: els.stage, ui, finish });
  } catch (e) {
    showError(e);
  }
}

function showError(e) {
  console.error(e);
  els.stage.replaceChildren(
    h('p', { class: 'error' }, 'Хата · Ошибка: ', String(e?.message || e)),
    h('div', { class: 'btn-row' }, h('button', { class: 'btn btn-main', type: 'button', onclick: () => location.reload() }, icon('replay'), ' Яңадан')));
}

async function init() {
  refreshToggles();
  pack = await loadPack(packId);
  audio.preload?.(pack.items);
  if (pack.settings.imageFit) document.body.dataset.fit = pack.settings.imageFit; // "cover" for photo tiles
  if (pack.settings.keepColor) document.body.dataset.keepColor = ''; // colours pack: don't grey out loto pictures
  if (!modes[modeId] || !pack.modes.includes(modeId)) modeId = pack.modes[0];
  document.title = `${pack.title} — Уен`;
  els.title.textContent = pack.title;
  els.sub.textContent = pack.subtitle || '';
  els.stars.textContent = stars.get(pack.id);
  if (pack.theme?.accent) document.documentElement.style.setProperty('--accent', pack.theme.accent);
  showStart();
}

window.addEventListener('pagehide', () => audio.stopVoice());
init().catch(showError);
registerSW();
