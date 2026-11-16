// Reusable UI pieces for game modes.
import { h } from './dom.js';
import { getSettings } from './storage.js';

/** Tatar phrase with each word coloured by role (adj / noun / verb …) + optional Russian hint. */
export function phrase(item, { big = true } = {}) {
  const showRu = getSettings().showRu;
  return h('div', { class: `phrase ${big ? 'phrase-big' : ''}` },
    h('div', { class: 'phrase-tt', lang: 'tt' },
      item.words.map((w) => h('span', { class: `w ${w.role ? 'w-' + w.role : ''}` }, w.tt))),
    showRu && item.ru ? h('div', { class: 'phrase-ru', lang: 'ru' }, item.ru) : null,
  );
}

export function speakButton(onclick, label = 'Тыңла') {
  return h('button', { class: 'round-btn speak-btn', type: 'button', 'aria-label': label, title: label, onclick }, icon('speaker'));
}

const ICONS = {
  speaker: '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
  mute: '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  back: '<path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  next: '<path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
  replay: '<path d="M4 12a8 8 0 1 0 2.4-5.7" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M4 4v5h5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  home: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" fill="currentColor"/>',
  paw: '<circle cx="7" cy="9" r="2.2" fill="currentColor"/><circle cx="12" cy="6.5" r="2.2" fill="currentColor"/><circle cx="17" cy="9" r="2.2" fill="currentColor"/><path d="M12 11c3 0 5.5 3.5 5.5 5.5S15 19 12 19s-5.5-.5-5.5-2.5S9 11 12 11z" fill="currentColor"/>',
};

export function icon(name) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('aria-hidden', 'true');
  s.classList.add('icon');
  s.innerHTML = ICONS[name] || '';
  return s;
}
