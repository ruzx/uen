// "Лото" — a 3×3 board (letter or picture in the middle) with faded pictures.
// Cards come one by one; the child drags the card onto its picture (or just taps the picture).
//   loto      – card shows picture + word
//   loto-ear  – card shows only a speaker: find the picture by ear
import { h, shuffle, wait, replayClass } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { burst } from '../core/fx.js';
import { phrase, speakButton, icon } from '../core/widgets.js';

function makeLoto({ id, title, emoji, listenOnly }) {
  return {
    id, title, emoji, minItems: 3,

    start({ pack, stage, ui, finish }) {
      const boardItems = shuffle(pack.items).slice(0, 8);
      const layout = shuffle([...boardItems, ...Array(8 - boardItems.length).fill(null)]);
      layout.splice(4, 0, 'center');
      const deck = shuffle(boardItems);

      let n = 0;
      let earned = 0;
      let missed = false;
      let busy = false;
      let alive = true;
      let cardEl = null;

      const cells = layout.map((it) => {
        if (it === 'center') {
          return h('div', { class: 'loto-cell loto-center' },
            pack.letter ? h('span', { class: 'loto-letter' }, pack.letter)
              : pack.settings.center ? h('span', { class: 'loto-letter loto-emoji' }, pack.settings.center)
                : h('img', { src: pack.coverUrl, alt: '' }));
        }
        if (!it) return h('div', { class: 'loto-cell loto-empty', 'aria-hidden': 'true' }, '✿');
        const el = h('button', {
          class: 'loto-cell', type: 'button', 'aria-label': listenOnly ? '' : it.tt,
          onclick: () => tryPlace(it, el),
        },
        h('img', { src: it.imageUrl, alt: '', draggable: 'false' }),
        h('span', { class: 'loto-word' }, it.tt));
        el._item = it;
        return el;
      });

      const board = h('div', { class: 'loto-board' }, cells);
      const deckBox = h('div', { class: 'loto-deck' });
      stage.replaceChildren(h('div', { class: 'loto' }, board, deckBox));

      function showCard() {
        const it = deck[n];
        missed = false;
        busy = false;
        ui.progress(n, deck.length);
        cardEl = h('div', { class: `card loto-card ${listenOnly ? 'listen' : ''}` },
          listenOnly ? icon('speaker') : h('img', { src: it.imageUrl, alt: '', draggable: 'false' }));
        deckBox.replaceChildren(
          h('div', { class: 'prompt-label' },
            listenOnly ? 'Тыңла да тап' : 'Урынын тап',
            h('span', { class: 'ru-hint' }, listenOnly ? ' · слушай и найди' : ' · найди место'),
            h('span', { class: 'count' }, ` ${n + 1} / ${deck.length}`)),
          cardEl,
          listenOnly
            ? h('div', { class: 'loto-hint' }, '☝️')
            : h('div', { class: 'prompt-row' }, phrase(it, { big: false }), speakButton(() => ui.speak(it))),
        );
        enableDrag(cardEl, it);
        replayClass(cardEl, 'deal');
        ui.speak(it);
      }

      function enableDrag(card, it) {
        card.addEventListener('pointerdown', (e) => {
          if (busy || !alive) return;
          e.preventDefault();
          const r = card.getBoundingClientRect();
          const ghost = card.cloneNode(true);
          ghost.classList.add('loto-ghost');
          Object.assign(ghost.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
          document.body.append(ghost);
          card.classList.add('lifted');
          const sx = e.clientX;
          const sy = e.clientY;
          let moved = false;
          let over = null;

          const move = (ev) => {
            if (Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) moved = true;
            ghost.style.transform = `translate(${ev.clientX - sx}px, ${ev.clientY - sy}px) rotate(-4deg)`;
            const c = cellAt(ev.clientX, ev.clientY);
            if (c !== over) { over?.classList.remove('over'); c?.classList.add('over'); over = c; }
          };
          const end = (ev) => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', end);
            window.removeEventListener('pointercancel', end);
            over?.classList.remove('over');
            card.classList.remove('lifted');
            const target = ev.type === 'pointerup' && moved ? cellAt(ev.clientX, ev.clientY) : null;
            if (target) {
              ghost.remove();
              tryPlace(target._item, target);
            } else {
              // fly back
              ghost.style.transition = 'transform .25s';
              ghost.style.transform = '';
              setTimeout(() => ghost.remove(), 260);
              if (!moved) ui.speak(it); // a tap on the card repeats the word
            }
          };
          window.addEventListener('pointermove', move);
          window.addEventListener('pointerup', end);
          window.addEventListener('pointercancel', end);
        });
      }

      function cellAt(x, y) {
        const el = document.elementFromPoint(x, y)?.closest('.loto-cell');
        return el && el._item && !el.classList.contains('placed') ? el : null;
      }

      function flyTo(from, to, src) {
        return new Promise((resolve) => {
          const a = from.getBoundingClientRect();
          const b = to.getBoundingClientRect();
          const g = h('img', { class: 'loto-fly', src, alt: '' });
          Object.assign(g.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
          document.body.append(g);
          from.style.visibility = 'hidden';
          requestAnimationFrame(() => requestAnimationFrame(() =>
            Object.assign(g.style, { left: `${b.left}px`, top: `${b.top}px`, width: `${b.width}px`, height: `${b.height}px` })));
          setTimeout(() => { g.remove(); resolve(); }, 430);
        });
      }

      async function tryPlace(item, el) {
        if (busy || !alive || el.classList.contains('placed')) return;
        const it = deck[n];
        if (item !== it) {
          missed = true;
          sfx.wrong();
          replayClass(el, 'shake');
          ui.speak(it);
          return;
        }
        busy = true;
        sfx.correct();
        await flyTo(cardEl, el, it.imageUrl);
        if (!alive) return;
        el.classList.add('placed');
        replayClass(el, `anim-${it.anim || 'bounce'}`);
        burst(el, { count: 8 });
        if (!missed) { earned++; ui.addStar(el); }
        await Promise.all([ui.speak(it), wait(900)]);
        if (!alive) return;
        n++;
        if (n < deck.length) {
          showCard();
        } else {
          ui.progress(deck.length, deck.length);
          deckBox.replaceChildren();
          board.classList.add('loto-done');
          sfx.win();
          await wait(1600);
          if (alive) finish({ stars: earned, total: deck.length });
        }
      }

      showCard();
      return () => { alive = false; document.querySelectorAll('.loto-ghost, .loto-fly').forEach((e) => e.remove()); };
    },
  };
}

export const loto = makeLoto({ id: 'loto', title: { tt: 'Лото', ru: 'Лото' }, emoji: '🧩', listenOnly: false });
export const lotoEar = makeLoto({ id: 'loto-ear', title: { tt: 'Тыңла', ru: 'Лото на слух' }, emoji: '👂', listenOnly: true });
