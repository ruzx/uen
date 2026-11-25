// Registry of game modes. To add a new game type:
//   1. create js/modes/<id>.js exporting { id, title:{tt,ru}, emoji, minItems, start(ctx) }
//   2. import + register it here (and add the file to SHELL in sw.js)
//   3. list its id in a pack's "modes" array
//
// start(ctx) receives:
//   ctx.pack    – normalized pack (items have tt, ru, words, imageUrl, audioUrl, anim…)
//   ctx.stage   – <main> element to render into
//   ctx.ui      – { speak(item), progress(i, n), addStar(fromEl) }
//   ctx.finish  – call with { stars, total } when the game ends
// and returns a cleanup function (called when leaving / restarting).

import learn from './learn.js';
import quiz from './quiz.js';
import { loto, lotoEar } from './loto.js';
import memory from './memory.js';
import shar from './shar.js';

export const modes = Object.fromEntries([learn, quiz, loto, lotoEar, memory, shar].map((m) => [m.id, m]));
