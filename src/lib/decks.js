import vocab from '../data/vocab.json';
import { mulberry32, shuffle } from './utils';

export const DECKS = {
  hf: { name: 'High-Frequency Words', desc: 'The words that show up most. Always first.', kind: 'word' },
  cm: { name: 'Common 1000 Words', desc: 'The rest of the classic SAT list.', kind: 'word' },
  roots: { name: 'Roots', desc: 'ambu, cred, spec… decode unknown words.', kind: 'aff', pos: 'root' },
  prefixes: { name: 'Prefixes', desc: 'Word beginnings like anti-, pre-, trans-.', kind: 'aff', pos: 'prefix' },
  suffixes: { name: 'Suffixes', desc: 'Word endings like -able, -cide, -logy.', kind: 'aff', pos: 'suffix' },
};

export const DECK_KEYS = Object.keys(DECKS);
export const WORD_DECKS = ['hf', 'cm'];
export const AFFIX_DECKS = ['roots', 'prefixes', 'suffixes'];
export const LEARNED = 'learned';

export const isAffix = (item) => DECKS[item.deck].kind === 'aff';

export const ITEMS = [];
export const BY_ID = {};
export const BY_DECK = {};

for (const key of DECK_KEYS) {
  BY_DECK[key] = [];
  vocab[key].forEach((x, i) => {
    const item = { id: key + i, deck: key, w: x.w, p: x.p || DECKS[key].pos, d: x.d, e: x.e || '' };
    ITEMS.push(item);
    BY_ID[item.id] = item;
    BY_DECK[key].push(item);
  });
}

/** Order in which new words are introduced: high-frequency first, then a fixed shuffle of the rest. */
export const LEARN_ORDER = {
  hf: BY_DECK.hf.map((x) => x.id),
  cm: shuffle(BY_DECK.cm.map((x) => x.id), mulberry32(7)),
};

export const deckTitle = (key) => (key === LEARNED ? "Words I've learned" : DECKS[key].name);
