// localStorage wrapper. Never throws (private mode, quota, etc.).
const PREFIX = 'uen:';

export const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(PREFIX + key);
      return v == null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch { /* ignore */ }
  },
};

const DEFAULT_SETTINGS = {
  muted: false,        // sound effects + voice
  showRu: true,        // small Russian hint under the Tatar phrase (for parents)
  ruVoiceFallback: false, // if no recording & no Tatar voice: read with a Russian TTS voice (bad accent!)
};

export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...store.get('settings', {}) };
}

export function saveSettings(s) {
  store.set('settings', s);
}

export const stars = {
  get: (packId) => store.get(`stars:${packId}`, 0),
  add: (packId, n = 1) => {
    const v = stars.get(packId) + n;
    store.set(`stars:${packId}`, v);
    return v;
  },
};
