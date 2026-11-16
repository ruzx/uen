// Voice (recorded files → Tatar TTS → optional Russian TTS) and synthesized sound effects.
// No sound files are needed for effects: they are generated with WebAudio.

import { getSettings } from './storage.js';

let ctx = null;
function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Call from a user gesture (e.g. the Start button) so mobile browsers allow sound. */
export function unlock() {
  ac();
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
}

const muted = () => getSettings().muted;

// ---------- voice ----------
let currentAudio = null;
const failedUrls = new Set();

export function stopVoice() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

/**
 * Say an item (or plain string). Resolves when finished (or after a safety timeout),
 * so games can `await speak(item)` before moving on.
 */
export function speak(itemOrText, { timeout = 5000 } = {}) {
  stopVoice();
  if (muted()) return Promise.resolve();
  const item = typeof itemOrText === 'string' ? { tt: itemOrText } : itemOrText;
  const done = new Promise((resolve) => {
    if (item.audioUrl && !failedUrls.has(item.audioUrl)) {
      const a = new Audio(item.audioUrl);
      currentAudio = a;
      a.onended = () => resolve();
      a.onerror = () => {
        failedUrls.add(item.audioUrl);
        tts(item.tt).then(resolve);
      };
      a.play().catch(() => tts(item.tt).then(resolve));
    } else {
      tts(item.tt).then(resolve);
    }
  });
  return Promise.race([done, new Promise((r) => setTimeout(r, timeout))]);
}

function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = speechSynthesis.getVoices();
  const tt = voices.find((v) => /^tt\b/i.test(v.lang));
  if (tt) return tt;
  if (getSettings().ruVoiceFallback) return voices.find((v) => /^ru\b/i.test(v.lang)) || null;
  return null;
}

function tts(text) {
  return new Promise((resolve) => {
    const voice = pickVoice();
    if (!voice || !text) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.85;
    u.onend = u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}

// ---------- sound effects ----------
function tone(freq, start, dur, { type = 'sine', gain = 0.14 } = {}) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + start;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sfx = {
  tap() { if (!muted()) tone(520, 0, 0.07, { gain: 0.06 }); },
  correct() { if (!muted()) { tone(660, 0, 0.14); tone(880, 0.11, 0.28); } },
  wrong() { if (!muted()) { tone(260, 0, 0.16, { type: 'triangle', gain: 0.1 }); tone(200, 0.12, 0.22, { type: 'triangle', gain: 0.1 }); } },
  win() { if (!muted()) [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.11, 0.35, { gain: 0.11 })); },
  star() { if (!muted()) tone(1200, 0, 0.12, { gain: 0.06 }); },
};
