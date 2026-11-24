export const pad2 = (n) => String(n).padStart(2, '0');
export const formatClock = (s) => `${Math.floor(s / 60)}:${pad2(s % 60)}`;
export const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);

export const dateKey = (d) => d.toLocaleDateString('en-CA');
export const todayKey = () => dateKey(new Date());
export const addDaysKey = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return dateKey(d);
};

export function mulberry32(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(arr, rand = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
