import { STORAGE_KEY, XP_PER_CORRECT } from './constants';
import { emptyDay, gradeWord, newWord } from './srs';
import { todayKey } from './utils';

export const defaultState = () => ({ xp: 0, right: 0, total: 0, days: {}, words: {}, batch: null });

export function loadState() {
  const base = defaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...base, ...saved } : base;
  } catch {
    return base;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: progress simply won't persist */
  }
}

const withDay = (state, patch) => {
  const t = todayKey();
  const cur = state.days[t] || emptyDay();
  return { ...state, days: { ...state.days, [t]: patch(cur) } };
};

export function progressReducer(state, action) {
  switch (action.type) {
    case 'answer': {
      const { id, correct, mode } = action;
      let next = withDay(state, (d) => ({
        ...d,
        total: d.total + 1,
        right: d.right + (correct ? 1 : 0),
        xp: d.xp + (correct ? XP_PER_CORRECT : 0),
        reviewed: d.reviewed + (mode === 'review' && state.words[id] ? 1 : 0),
      }));
      next = {
        ...next,
        total: state.total + 1,
        right: state.right + (correct ? 1 : 0),
        xp: state.xp + (correct ? XP_PER_CORRECT : 0),
      };
      const word = state.words[id];
      if (word && mode !== 'intro') next.words = { ...state.words, [id]: gradeWord(word, correct) };
      return next;
    }

    case 'setBatch':
      return { ...state, batch: action.batch };

    case 'finishBatch': {
      if (!state.batch || state.batch.done) return state;
      const { ids } = state.batch;
      const words = { ...state.words };
      ids.forEach((id) => {
        if (!words[id]) words[id] = newWord();
        if (action.result[id] === false) words[id] = { ...words[id], miss: words[id].miss + 1 };
      });
      return withDay({ ...state, words, batch: { ...state.batch, done: true } }, (d) => ({
        ...d,
        learned: d.learned + ids.length,
      }));
    }

    case 'reset':
      return defaultState();

    default:
      return state;
  }
}
