import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import PageHeader from '../ui/PageHeader';
import ProgressBar from '../ui/ProgressBar';
import { POS_LABELS, XP_PER_CORRECT } from '../../lib/constants';
import { BY_DECK, isAffix } from '../../lib/decks';
import { makeOptions } from '../../lib/srs';
import { highlightParts } from '../../lib/text';
import { shuffle } from '../../lib/utils';
import { useKey } from '../../hooks/useKey';
import { useProgress } from '../../hooks/ProgressContext';
import QuizResults from './QuizResults';
import './quiz.css';

function Example({ item }) {
  if (!item.e) return null;
  if (isAffix(item)) return <div className="fb__ex">Examples: {item.e}</div>;
  return (
    <div className="fb__ex">
      <em>{highlightParts(item.e, item.w).map((p, i) => (p.hit ? <mark key={i}>{p.text}</mark> : p.text))}</em>
    </div>
  );
}

/**
 * Multiple-choice quiz. Missed words are re-queued once at the end ("second try").
 * `mode`: 'practice' | 'review' (affects spaced repetition) | 'intro' (first exposure, no box change).
 */
export default function QuizRunner({ items, title, mode = 'practice', stepper, onFinish, again, onRetryMissed, onHome }) {
  const { state, dispatch } = useProgress();
  const total = items.length;
  const xp0 = useRef(state.xp);

  const [queue, setQueue] = useState(() => shuffle(items).map((it) => ({ it, retry: false })));
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [results, setResults] = useState({});

  const finished = i >= queue.length;
  const entry = queue[i];
  const options = useMemo(() => (entry ? makeOptions(entry.it, BY_DECK[entry.it.deck]) : []), [entry]);

  const finishedRef = useRef(false);
  useEffect(() => {
    if (finished && !finishedRef.current) {
      finishedRef.current = true;
      onFinish?.(results);
    }
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (k) => {
    if (answer !== null || finished) return;
    const ok = options[k].id === entry.it.id;
    setAnswer(k);
    if (!entry.retry) {
      setResults((r) => ({ ...r, [entry.it.id]: ok }));
      dispatch({ type: 'answer', id: entry.it.id, correct: ok, mode });
      if (!ok) setQueue((q) => [...q, { it: entry.it, retry: true }]);
    }
  };
  const next = () => {
    setAnswer(null);
    setI((n) => n + 1);
  };

  useKey((e) => {
    if (finished) return;
    if (answer === null && /^[1-4]$/.test(e.key)) pick(+e.key - 1);
    else if (answer !== null && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      next();
    }
  });

  if (finished) {
    const ids = Object.keys(results);
    return (
      <QuizResults
        stepper={stepper}
        ids={ids}
        results={results}
        xpGained={state.xp - xp0.current}
        again={again}
        onRetryMissed={onRetryMissed}
        onHome={onHome}
      />
    );
  }

  const { it, retry } = entry;
  const affix = isAffix(it);
  const done = answer !== null;
  const correct = done && options[answer].id === it.id;

  return (
    <div className="content--narrow stack">
      <PageHeader title={title} />
      {stepper}
      <div>
        <div className="study-count">
          <span>{retry ? 'Retry' : `Question ${Math.min(i + 1, total)} of ${total}`}</span>
        </div>
        <ProgressBar value={(100 * i) / queue.length} label="Quiz progress" className="study-bar" />
      </div>

      <section className="q" key={`${i}`}>
        <div className="eyebrow">
          {affix ? `What does this ${POS_LABELS[it.p]} mean?` : 'Pick the definition'}
          {retry && <span className="q__tag">Second try</span>}
        </div>
        <h2 className="q__word">{it.w}</h2>
        <div className="q__pos">{!affix && POS_LABELS[it.p]}</div>

        <div className="q__options" role="group" aria-label="Answer choices">
          {options.map((o, k) => {
            const cls = done ? (o.id === it.id ? 'is-correct' : k === answer ? 'is-wrong' : 'is-dim') : '';
            return (
              <button key={o.id} type="button" className={`opt ${cls}`} disabled={done} onClick={() => pick(k)}>
                <span className="opt__key">{done && o.id === it.id ? <Icon name="check" size={14} strokeWidth={3} /> : k + 1}</span>
                <span>{o.d}</span>
              </button>
            );
          })}
        </div>

        {done && (
          <div className={`fb ${correct ? 'fb--ok' : 'fb--bad'}`} role="status">
            <strong className="fb__head">{correct ? `Correct! +${XP_PER_CORRECT} XP` : 'Not quite.'}</strong>
            <span>
              <strong>{it.w}</strong> = {it.d}
            </span>
            <Example item={it} />
          </div>
        )}
        {done && (
          <div className="q__next">
            <Button variant="primary" onClick={next}>
              {i + 1 >= queue.length ? 'See results' : 'Next'} <Icon name="arrow" />
            </Button>
            <span className="study-keys">
              <kbd>Enter</kbd> to continue
            </span>
          </div>
        )}
      </section>
      {!done && (
        <p className="study-keys">
          Press <kbd>1</kbd>–<kbd>4</kbd> to answer
        </p>
      )}
    </div>
  );
}
