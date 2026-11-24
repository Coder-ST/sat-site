import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import ProgressBar from '../components/ui/ProgressBar';
import { useProgress } from '../hooks/ProgressContext';
import { BY_ID, DECKS, DECK_KEYS, LEARNED, LEARN_ORDER, deckTitle } from '../lib/decks';
import { isIntroduced } from '../lib/srs';
import { pct, shuffle } from '../lib/utils';
import { useDeckItems } from './Flashcards';

const COUNTS = [10, 20, 30, 50];
const COUNT_LABEL = { roots: 'roots to decode words', prefixes: 'word beginnings', suffixes: 'word endings', learned: 'words learned' };
const TONES = { hf: 'blue', cm: 'purple', roots: 'orange', prefixes: 'teal', suffixes: 'rose', learned: 'green' };

function DeckCard({ deck, count: qCount }) {
  const { state } = useProgress();
  const navigate = useNavigate();
  const items = useDeckItems(deck, state);
  const isWords = deck === 'hf' || deck === 'cm';
  const seen = isWords ? items.filter((x) => isIntroduced(state, x.id)).length : 0;

  const quiz = () =>
    navigate('/quiz', {
      state: { ids: shuffle(items).slice(0, qCount).map((x) => x.id), title: deckTitle(deck), mode: 'practice' },
    });

  const preview =
    deck === LEARNED
      ? items.slice().sort((a, b) => (state.words[b.id].on > state.words[a.id].on ? 1 : -1)).slice(0, 4)
      : isWords
        ? LEARN_ORDER[deck].filter((id) => !state.words[id]).slice(0, 4).map((id) => BY_ID[id])
        : items.slice(0, 4);
  const previewLabel = deck === LEARNED ? 'Recently learned' : isWords ? 'Up next' : 'Includes';

  const meta = deck === LEARNED ? 'Everything from your daily sessions.' : DECKS[deck].desc;
  const kind = deck === LEARNED ? 'Your words' : DECKS[deck].kind === 'word' ? 'Vocabulary' : 'Word parts';

  return (
    <section className={`deck tone-${TONES[deck]}`}>
      <span className="eyebrow">{kind}</span>
      <span className="deck__name">{deckTitle(deck)}</span>
      <span className="deck__meta">{meta}</span>
      <span className="deck__count num">{items.length}</span>
      <span className="deck__meta">{isWords ? `${seen} learned · ${items.length - seen} to go` : COUNT_LABEL[deck]}</span>
      {isWords && <ProgressBar value={pct(seen, items.length)} label={`${deckTitle(deck)} progress`} />}
      <span className="eyebrow deck__preview-title">{previewLabel}</span>
      {preview.length ? (
        <ul className="deck__preview">
          {preview.map((x) => (
            <li key={x.id}>
              <strong>{x.w}</strong>
              <span>{x.d}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="deck__hint">Words you learn show up here.</div>
      )}
      <div className="deck__actions">
        <Button variant="primary" size="sm" to={`/cards/${deck}`} disabled={!items.length}>
          Flashcards
        </Button>
        <Button size="sm" onClick={quiz} disabled={items.length < 4}>
          Quiz
        </Button>
      </div>
    </section>
  );
}

export default function Study() {
  const [count, setCount] = useState(10);

  return (
    <div className="stack">
      <PageHeader
        title="Study"
        actions={
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 14 }}>
            Quiz length
            <select className="field" value={count} onChange={(e) => setCount(+e.target.value)}>
              {COUNTS.map((n) => (
                <option key={n} value={n}>
                  {n} questions
                </option>
              ))}
            </select>
          </label>
        }
      >
        Pick a deck. Flip through flashcards, or take a quiz on it.
      </PageHeader>
      <div className="deck-grid fill">
        {[...DECK_KEYS, LEARNED].map((k) => (
          <DeckCard key={k} deck={k} count={count} />
        ))}
      </div>
    </div>
  );
}
