// "Тап!" — hear/see a phrase, tap the matching picture.
import { h, shuffle, sample, wait, replayClass } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { burst } from '../core/fx.js';
import { phrase, speakButton } from '../core/widgets.js';

export default {
  id: 'quiz',
  title: { tt: 'Тап!', ru: 'Найди' },
  emoji: '🎯',
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

      const cards = choices.map((item) =>
        h('button', {
          class: 'card pick-card', type: 'button', 'aria-label': item.tt,
          onclick: (e) => pick(item, e.currentTarget),
        }, h('img', { src: item.imageUrl, alt: '', draggable: 'false' })));

      stage.replaceChildren(
        h('div', { class: 'prompt' },
          h('div', { class: 'prompt-label' }, pack.ui?.find ?? 'Тап!', h('span', { class: 'ru-hint' }, ' · найди'), h('span', { class: 'count' }, ` ${round + 1} / ${rounds.length}`)),
          h('div', { class: 'prompt-row' }, phrase(target), speakButton(() => ui.speak(target)))),
        h('div', { class: `grid grid-${choicesN}` }, cards),
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
        sfx.correct();
        el.classList.add('correct', `anim-${item.anim || 'bounce'}`);
        cards.forEach((c) => c !== el && c.classList.add('fade'));
        burst(el);
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
