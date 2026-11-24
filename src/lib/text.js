import { escapeRegExp } from './utils';

/** Split an example sentence into [{text, hit}] so the target word (and its inflections) can be highlighted. */
export function highlightParts(sentence, word) {
  if (!sentence) return [];
  const stem = word.replace(/[^a-z]/gi, '').toLowerCase();
  if (!stem) return [{ text: sentence, hit: false }];
  const root = escapeRegExp(stem.slice(0, Math.max(3, stem.length - 3)));
  const re = new RegExp(`\\b(${root}\\w*)`, 'ig');
  const parts = [];
  let last = 0;
  for (const m of sentence.matchAll(re)) {
    if (m.index > last) parts.push({ text: sentence.slice(last, m.index), hit: false });
    parts.push({ text: m[0], hit: true });
    last = m.index + m[0].length;
  }
  if (last < sentence.length) parts.push({ text: sentence.slice(last), hit: false });
  return parts;
}

export function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch {
    /* speech unsupported */
  }
}
