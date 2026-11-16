// "Өйрән" — flashcards: one big picture, tap it to hear the phrase and see the adjective "acted out".
import { h, replayClass } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { phrase, speakButton, icon } from '../core/widgets.js';

export default {
  id: 'learn',
  title: { tt: 'Өйрән', ru: 'Учим' },
  emoji: '📖',
  minItems: 1,

  start({ pack, stage, ui, finish }) {
    const items = pack.items;
    let i = 0;
    let alive = true;

    function act(fig, item) {
      replayClass(fig, `anim-${item.anim || 'bounce'}`);
      ui.speak(item);
    }

    function render() {
      const item = items[i];
      ui.progress(i, items.length);
      const fig = h('button', { class: 'card learn-card', type: 'button', 'aria-label': item.tt, onclick: () => act(fig, item) },
        h('img', { src: item.imageUrl, alt: '', draggable: 'false' }));

      const prev = h('button', { class: 'round-btn nav-btn', type: 'button', 'aria-label': 'Алдагы', disabled: i === 0,
        onclick: () => { sfx.tap(); i--; render(); } }, icon('back'));
      const next = h('button', { class: 'round-btn nav-btn nav-next', type: 'button', 'aria-label': 'Киләсе',
        onclick: () => { sfx.tap(); if (i < items.length - 1) { i++; render(); } else finish({ stars: 0, total: items.length, learn: true }); } }, icon('next'));

      stage.replaceChildren(
        h('div', { class: 'learn' },
          h('div', { class: 'learn-row' }, prev, fig, next),
          h('div', { class: 'prompt-row' }, phrase(item), speakButton(() => act(fig, item)))),
      );
      setTimeout(() => alive && act(fig, item), 250);
    }

    render();
    return () => { alive = false; };
  },
};
