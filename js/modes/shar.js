// "Шарлар" — balloons float up; the child hears a word and pops the matching balloon.
// Made for the colours pack: each item's "color" paints its balloon.
// Items without "color" get a pale balloon with the item's picture inside, so any pack can use it.
import { h, shuffle, sample, wait, replayClass } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { burst } from '../core/fx.js';
import { phrase, speakButton } from '../core/widgets.js';

const NS = 'http://www.w3.org/2000/svg';
const O = '#3b2a22';

function balloonSvg(item) {
  const fill = item.color || '#fff4d6';
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', '0 0 200 300');
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML =
    `<path d="M100 214 q-14 22 4 40 q16 18 -2 44" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>` +
    `<path d="M88 214 h24 l-6 -14 h-12 Z" fill="${fill}" stroke="${O}" stroke-width="5" stroke-linejoin="round"/>` +
    `<ellipse cx="100" cy="104" rx="82" ry="98" fill="${fill}" stroke="${O}" stroke-width="6"/>` +
    `<ellipse cx="66" cy="62" rx="14" ry="28" fill="#fff" opacity=".5" transform="rotate(-25 66 62)"/>`;
  if (!item.color && item.imageUrl) {
    const img = document.createElementNS(NS, 'image');
    img.setAttribute('href', item.imageUrl);
    img.setAttribute('x', '32'); img.setAttribute('y', '40');
    img.setAttribute('width', '136'); img.setAttribute('height', '136');
    s.append(img);
  }
  return s;
}

export default {
  id: 'shar',
  title: { tt: 'Шарлар', ru: 'Шарики' },
  emoji: '🎈',
  minItems: 2,

  start({ pack, stage, ui, finish }) {
    const choicesN = Math.min(pack.items.length, pack.settings.choices ?? 4);
    const rounds = shuffle(pack.items).slice(0, pack.settings.rounds ?? pack.items.length);
    let round = 0;
    let earned = 0;
    let alive = true;

    function render() {
      const target = rounds[round];
      const choices = shuffle([target, ...sample(pack.items.filter((i) => i !== target), choicesN - 1)]);
      let missed = false;
      let locked = false;

      ui.progress(round, rounds.length);

      const balloons = choices.map((item, k) =>
        h('button', {
          class: 'balloon', type: 'button', 'aria-label': item.tt,
          onclick: (e) => pick(item, e.currentTarget),
        }, balloonSvg(item)));
      // custom properties must go through setProperty (Object.assign on style ignores them)
      balloons.forEach((b, k) => { b.style.setProperty('--d', `${k * 0.12}s`); b.style.setProperty('--b', `${(k * 0.7) % 2}s`); });
      const field = h('div', { class: `balloons n${choicesN}` }, balloons);
      field.style.setProperty('--n', choicesN);

      stage.replaceChildren(
        h('div', { class: 'prompt' },
          h('div', { class: 'prompt-label' }, 'Шарны тот', h('span', { class: 'ru-hint' }, ' · лопни шарик'), h('span', { class: 'count' }, ` ${round + 1} / ${rounds.length}`)),
          h('div', { class: 'prompt-row' }, phrase(target), speakButton(() => ui.speak(target)))),
        field,
      );
      ui.speak(target);

      async function pick(item, el) {
        if (locked || !alive) return;
        if (item !== target) {
          missed = true;
          sfx.wrong();
          replayClass(el, 'shake');
          el.classList.add('dim');
          el.disabled = true;
          return;
        }
        locked = true;
        sfx.pop();
        sfx.correct();
        burst(el, { chars: ['🎉', '✨', '⭐'] });
        el.classList.add('popped');
        balloons.forEach((b) => b !== el && b.classList.add('away'));
        if (!missed) { earned++; ui.addStar(el); }
        await Promise.all([ui.speak(target), wait(1400)]);
        if (!alive) return;
        round++;
        if (round < rounds.length) render();
        else finish({ stars: earned, total: rounds.length });
      }
    }

    render();
    return () => { alive = false; };
  },
};
