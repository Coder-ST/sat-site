import { INTERVALS, MAX_BOX } from './constants';
import { BY_ID, LEARN_ORDER } from './decks';
import { addDaysKey, dateKey, shuffle, todayKey } from './utils';

export const emptyDay = () => ({ sec: 0, xp: 0, learned: 0, reviewed: 0, right: 0, total: 0 });

export const isIntroduced = (state, id) => !!state.words[id];

export const dueIds = (state) => {
  const t = todayKey();
  return Object.keys(state.words)
    .filter((id) => state.words[id].due <= t && BY_ID[id])
    .sort((a, b) => (state.words[a].due < state.words[b].due ? -1 : 1));
};

export const troubleIds = (state) =>
  Object.keys(state.words).filter((id) => BY_ID[id] && state.words[id].miss > 0 && state.words[id].box <= 1);

export const learnedItems = (state) => Object.keys(state.words).map((id) => BY_ID[id]).filter(Boolean);

export function pickNew(state, n) {
  const out = [];
  for (const k of ['hf', 'cm']) {
    for (const id of LEARN_ORDER[k]) {
      if (!state.words[id]) {
        out.push(id);
        if (out.length >= n) return out;
      }
    }
  }
  return out;
}

export function streak(state) {
  const learnedOn = (d) => (state.days[dateKey(d)]?.learned ?? 0) > 0;
  const d = new Date();
  if (!learnedOn(d)) d.setDate(d.getDate() - 1);
  let s = 0;
  while (learnedOn(d)) {
    s++;
    d.setDate(d.getDate() - 1);
  }
  return s;
}

/** Apply one answer to a word's Leitner box. Returns the new word record. */
export function gradeWord(word, correct) {
  const t = todayKey();
  if (correct) {
    const next = { ...word, ok: word.ok + 1 };
    if (word.due <= t) {
      next.box = Math.min(MAX_BOX, word.box + 1);
      next.due = addDaysKey(INTERVALS[next.box]);
    }
    return next;
  }
  return { ...word, miss: word.miss + 1, box: 0, due: addDaysKey(1) };
}

export const newWord = () => ({ box: 0, due: addDaysKey(1), ok: 0, miss: 0, on: todayKey() });

/** Build 4 multiple-choice options (1 correct + 3 distractors, same part of speech preferred). */
export function makeOptions(item, pool) {
  const candidates = pool.filter((x) => x.id !== item.id && x.d !== item.d);
  const same = shuffle(candidates.filter((x) => x.p === item.p));
  const other = shuffle(candidates.filter((x) => x.p !== item.p));
  const seen = new Set([item.d]);
  const picks = [];
  for (const x of same.concat(other)) {
    if (!seen.has(x.d)) {
      seen.add(x.d);
      picks.push(x);
      if (picks.length === 3) break;
    }
  }
  return shuffle([item, ...picks]);
}
