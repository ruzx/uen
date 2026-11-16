// Content packs live in /packs/<id>/pack.json together with their images and audio.
// A pack is pure data; game modes (js/modes/*) decide how to play it.

const PACKS_ROOT = new URL('../../packs/', import.meta.url);

export async function loadPackIds() {
  const res = await fetch(new URL('index.json', PACKS_ROOT));
  if (!res.ok) throw new Error('packs/index.json табылмады');
  const { packs } = await res.json();
  return packs;
}

export async function loadPack(id) {
  if (!/^[a-z0-9_-]+$/i.test(id)) throw new Error(`Bad pack id: ${id}`);
  const dir = new URL(`${id}/`, PACKS_ROOT);
  const res = await fetch(new URL('pack.json', dir));
  if (!res.ok) throw new Error(`Pack "${id}" табылмады`);
  const pack = await res.json();
  return normalizePack(pack, id, dir);
}

function normalizePack(pack, id, dir) {
  pack.id = id;
  pack.modes ??= ['learn', 'quiz'];
  pack.settings ??= {};
  pack.coverUrl = pack.cover ? new URL(pack.cover, dir).href : null;
  const letter = pack.letter?.toLocaleLowerCase('tt');
  pack.items = (pack.items || []).map((it) => {
    let words = it.words || [{ tt: it.tt, ru: it.ru }];
    // letter packs: mark words that start with the pack's letter (rendered in red)
    if (letter) words = words.map((w) => (w.tt?.toLocaleLowerCase('tt').startsWith(letter) ? { ...w, hl: letter.length } : w));
    return {
      ...it,
      words,
      tt: it.tt ?? words.map((w) => w.tt).join(' '),
      ru: it.ru ?? words.map((w) => w.ru).filter(Boolean).join(' '),
      imageUrl: new URL(it.image, dir).href,
      audioUrl: it.audio ? new URL(it.audio, dir).href : null,
    };
  });
  return pack;
}
