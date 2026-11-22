// "Пар тап" — memory: turn two cards, find the matching pair. Every turned card says its word.
// pack.settings.pairs – number of pairs (default 6; fewer if the pack is smaller)
import { h, shuffle, wait, replayClass } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { burst } from '../core/fx.js';
import { icon } from '../core/widgets.js';

export default {
  id: 'memory',
  title: { tt: 'Пар тап', ru: 'Найди пару' },
  emoji: '🃏',
  minItems: 2,

  start({ pack, stage, ui, finish }) {
    const pairs = Math.min(pack.items.length, pack.settings.pairs ?? 6);
    const chosen = shuffle(pack.items).slice(0, pairs);
    const deck = shuffle([...chosen, ...chosen]);
    let open = [];
    let found = 0;
    let busy = false;
    let alive = true;

    ui.progress(0, pairs);

    const cards = deck.map((item) => {
      const el = h('button', { class: 'mem-card', type: 'button', 'aria-label': 'Карточка', onclick: () => flip(el) },
        h('div', { class: 'mem-inner' },
          h('div', { class: 'mem-face mem-back' }, icon('paw')),
          h('div', { class: 'mem-face mem-front' },
            h('img', { src: item.imageUrl, alt: '', draggable: 'false' }),
            h('span', { class: 'mem-word' }, item.tt))));
      el._item = item;
      return el;
    });

    stage.replaceChildren(
      h('div', { class: 'prompt-label' }, 'Пар тап', h('span', { class: 'ru-hint' }, ' · найди пару')),
      h('div', { class: `mem-grid mem-${deck.length}` }, cards),
    );

    async function flip(el) {
      if (busy || !alive || el.classList.contains('open')) return;
      sfx.tap();
      el.classList.add('open');
      ui.speak(el._item);
      open.push(el);
      if (open.length < 2) return;

      busy = true;
      const [a, b] = open;
      open = [];
      if (a._item === b._item) {
        await wait(450);
        if (!alive) return;
        sfx.correct();
        [a, b].forEach((c) => { c.classList.add('matched'); replayClass(c, 'pop-in'); });
        burst(b, { count: 8 });
        found++;
        ui.addStar(b);
        ui.progress(found, pairs);
        busy = false;
        if (found === pairs) {
          await wait(1300);
          if (alive) finish({ stars: found, total: pairs });
        }
      } else {
        await wait(1300);
        if (!alive) return;
        a.classList.remove('open');
        b.classList.remove('open');
        busy = false;
      }
    }

    return () => { alive = false; };
  },
};
