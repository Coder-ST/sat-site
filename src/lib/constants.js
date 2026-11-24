export const STORAGE_KEY = 'satvocab_v1';
/** Spaced-repetition intervals in days, indexed by Leitner box. */
export const INTERVALS = [1, 3, 7, 14, 30];
export const MAX_BOX = INTERVALS.length - 1;
export const WORDS_PER_DAY = 10;
export const XP_PER_CORRECT = 10;
export const XP_DAILY_GOAL = 100;
export const LEARNER_NAME = 'Sreehari';

export const POS_LABELS = {
  v: 'verb',
  n: 'noun',
  adj: 'adjective',
  adv: 'adverb',
  root: 'root',
  prefix: 'prefix',
  suffix: 'suffix',
};
