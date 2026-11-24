import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Stepper from '../components/ui/Stepper';
import FlashcardViewer from '../components/flashcards/FlashcardViewer';
import QuizRunner from '../components/quiz/QuizRunner';
import { useProgress } from '../hooks/ProgressContext';
import { POS_LABELS, WORDS_PER_DAY } from '../lib/constants';
import { BY_ID } from '../lib/decks';
import { dueIds, pickNew, troubleIds } from '../lib/srs';
import { shuffle, todayKey } from '../lib/utils';

const REVIEW_LIMIT = 20;

const STEPS = [
  ['Flashcards', 'Flip through the 10 new words. Tap the card or press space to see the definition.'],
  ['Quiz', 'Pick the right definition for each word. Missed words get one more try.'],
  ['Results', 'See your score. Missed words come back tomorrow for review.'],
];

/** /session — today's batch, plus anything due for review. */
export function SessionPreview() {
  const { state, dispatch } = useProgress();
  const navigate = useNavigate();
  const { batch } = state;
  const needsBatch = !batch || batch.date !== todayKey() || batch.done;
  const fresh = needsBatch ? pickNew(state, WORDS_PER_DAY) : null;

  useEffect(() => {
    if (needsBatch && fresh.length) dispatch({ type: 'setBatch', batch: { date: todayKey(), ids: fresh, done: false } });
  }, [needsBatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const due = dueIds(state);
  const trouble = troubleIds(state);
  const startReview = (ids, title) => navigate('/quiz', { state: { ids, title, mode: 'review' } });

  const noNew = needsBatch && !fresh.length;
  if (needsBatch && !noNew) return null;

  const items = noNew ? [] : batch.ids.map((id) => BY_ID[id]);
  const hf = items.filter((x) => x.deck === 'hf').length;
  const source = !items.length
    ? "You've seen every word in the bank."
    : hf === items.length
      ? 'All from your High-Frequency list.'
      : hf
        ? `${hf} High-Frequency + ${items.length - hf} from the Common 1000.`
        : 'From the Common 1000 list.';

  return (
    <div className="stack">
      <PageHeader
        title="Daily Session"
        actions={
          items.length > 0 && (
            <Button variant="primary" to="/session/cards">
              Start flashcards <Icon name="arrow" />
            </Button>
          )
        }
      >
        {source} Flip through the words, then take a quiz right away.
      </PageHeader>

      <section className="stats">
        <StatCard label="New words today" value={items.length} tone="blue" icon="cap" cta="Start flashcards" to="/session/cards" />
        <StatCard
          label="Due for review"
          value={due.length}
          tone="purple"
          icon="review"
          cta={due.length ? `Review ${Math.min(REVIEW_LIMIT, due.length)}` : 'Nothing due'}
          onClick={() => startReview(due.slice(0, REVIEW_LIMIT), 'Review')}
          disabled={!due.length}
        />
        <StatCard
          label="Trouble words"
          value={trouble.length}
          tone="orange"
          icon="target"
          cta={trouble.length ? `Drill ${Math.min(REVIEW_LIMIT, trouble.length)}` : 'None yet'}
          onClick={() => startReview(shuffle(trouble).slice(0, REVIEW_LIMIT), 'Trouble words')}
          disabled={!trouble.length}
        />
      </section>

      <div className="split fill">
        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Today's words</h2>
            <span className="panel__meta num">{items.length} words</span>
          </div>
          {items.length ? (
            <ol className="list">
              {items.map((x, i) => (
                <li key={x.id}>
                  <span className="list__idx num">{i + 1}</span>
                  <div className="list__main">
                    <span className="list__word">{x.w}</span> <span className="list__sub">{POS_LABELS[x.p]}</span>
                  </div>
                  <span className={`chip tone-${x.deck === 'hf' ? 'blue' : 'purple'}`}>{x.deck === 'hf' ? 'High-Frequency' : 'Common 1000'}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="panel__empty">
              <strong>All words introduced</strong>
              Use Study and Review to lock them in.
            </div>
          )}
        </section>

        <div className="col">
          <section className="panel panel--grad">
            <div className="panel__head">
              <h2 className="panel__title">How it works</h2>
            </div>
            <ol className="list">
              {STEPS.map(([title, text], i) => (
                <li key={title}>
                  <span className={`step-num num tone-${['blue', 'purple', 'green'][i]}`}>{i + 1}</span>
                  <div className="list__main">
                    <div className="list__word">{title}</div>
                    <div className="list__sub">{text}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Review queue</h2>
              <span className="panel__meta num">{due.length} due</span>
            </div>
            {due.length ? (
              <ul className="list">
                {due.slice(0, 4).map((id) => (
                  <li key={id}>
                    <div className="list__main">
                      <span className="list__word">{BY_ID[id].w}</span>
                      <div className="list__sub">{BY_ID[id].d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="panel__empty">
                <strong>Nothing due</strong>
                Words come back 1, 3, 7, 14, then 30 days after you get them right.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/** /session/cards — step 1. */
export function SessionCards() {
  const { state } = useProgress();
  const navigate = useNavigate();
  if (!state.batch) return <Navigate to="/session" replace />;
  const items = state.batch.ids.map((id) => BY_ID[id]);
  return (
    <FlashcardViewer
      items={items}
      title="Today's flashcards"
      header={<Stepper current={0} />}
      finalAction={{ label: 'Start quiz', onClick: () => navigate('/session/quiz') }}
    />
  );
}

/** /session/quiz — steps 2 and 3. */
export function SessionQuiz() {
  const { state, dispatch } = useProgress();
  const navigate = useNavigate();
  if (!state.batch) return <Navigate to="/session" replace />;
  const ids = state.batch.ids;
  const items = ids.map((id) => BY_ID[id]);

  return (
    <QuizRunner
      key={ids.join(',')}
      items={items}
      title="Today's quiz"
      mode="intro"
      stepper={<SessionStepper />}
      onFinish={(result) => dispatch({ type: 'finishBatch', result })}
      onRetryMissed={(missed) => navigate('/quiz', { state: { ids: missed, title: 'Missed words', mode: 'practice' } })}
      onHome={() => navigate('/')}
      again={{
        label: `Learn ${WORDS_PER_DAY} more`,
        onClick: () => {
          dispatch({ type: 'setBatch', batch: null });
          navigate('/session');
        },
      }}
    />
  );
}

/** Stepper that flips to "results" once the quiz finishes (batch is marked done). */
function SessionStepper() {
  const { state } = useProgress();
  return <Stepper current={state.batch?.done ? 2 : 1} />;
}
