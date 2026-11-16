// Visual effects: star bursts and a star flying to the score counter.

export function burst(target, { count = 12, chars = ['⭐', '✨', '🌟'] } = {}) {
  const r = target.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'fx-particle';
    s.textContent = chars[i % chars.length];
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = 90 + Math.random() * 90;
    s.style.left = `${cx}px`;
    s.style.top = `${cy}px`;
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    s.style.setProperty('--rot', `${Math.random() * 360}deg`);
    document.body.append(s);
    s.addEventListener('animationend', () => s.remove());
  }
}

export function flyStar(from, to) {
  return new Promise((resolve) => {
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const s = document.createElement('span');
    s.className = 'fx-fly';
    s.textContent = '⭐';
    s.style.left = `${a.left + a.width / 2}px`;
    s.style.top = `${a.top + a.height / 2}px`;
    document.body.append(s);
    requestAnimationFrame(() => {
      s.style.transform = `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(.6)`;
    });
    setTimeout(() => { s.remove(); resolve(); }, 750);
  });
}
