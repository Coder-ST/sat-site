import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import PageHeader from '../components/ui/PageHeader';
import ProgressBar from '../components/ui/ProgressBar';
import StatCard from '../components/ui/StatCard';
import { useProgress, useToday } from '../hooks/ProgressContext';
import { LEARNER_NAME, WORDS_PER_DAY, XP_DAILY_GOAL } from '../lib/constants';
import { BY_DECK } from '../lib/decks';
import { dueIds, isIntroduced, pickNew, streak } from '../lib/srs';
import { dateKey, pct } from '../lib/utils';
import './home.css';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

function lastSevenDays(days) {
  const out = [];
  for (let n = 6; n >= 0; n--) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    out.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count: days[dateKey(d)]?.total || 0,
      today: n === 0,
    });
  }
  return out;
}

function Bar({ label, value, total, tone }) {
  return (
    <div className={`row-item ${tone ? `tone-${tone}` : ''}`}>
      <div className="row-item__head">
        <strong>{label}</strong>
        <span className="num muted">{total ? `${value} / ${total}` : value}</span>
      </div>
      <ProgressBar value={pct(value, total || value)} label={label} />
    </div>
  );
}

export default function Home() {
  const { state } = useProgress();
  const day = useToday();

  const due = dueIds(state).length;
  const hfDone = BY_DECK.hf.filter((x) => isIntroduced(state, x.id)).length;
  const cmDone = BY_DECK.cm.filter((x) => isIntroduced(state, x.id)).length;
  const mastered = Object.values(state.words).filter((w) => w.box >= 3).length;
  const learnedToday = Math.min(day.learned, WORDS_PER_DAY);
  const doneToday = day.learned >= WORDS_PER_DAY;
  const accuracy = pct(state.right, state.total);

  const week = lastSevenDays(state.days);
  const maxCount = Math.max(10, ...week.map((w) => w.count));
  const today = new Date();

  return (
    <div className="stack">
      <PageHeader
        title={`${greeting()}, ${LEARNER_NAME}`}
        actions={
          <Button variant="primary" to="/session">
            {doneToday ? `Learn ${WORDS_PER_DAY} more` : 'Start learning'} <Icon name="arrow" />
          </Button>
        }
      >
        {doneToday
          ? `Today's ${WORDS_PER_DAY} words are done. Nice work.`
          : `${WORDS_PER_DAY} new words a day. High-frequency words come first.`}
      </PageHeader>

      <section className="stats">
        <StatCard label="Learned today" value={`${learnedToday} / ${WORDS_PER_DAY}`} tone="blue" icon="cap" cta="Daily session" to="/session" />
        <StatCard label="Due for review" value={due} tone="purple" icon="review" cta="Review" to="/session" />
        <StatCard label="Mastered" value={mastered} tone="green" icon="check" cta="Word list" to="/words" />
      </section>

      <div className="split fill">
        <div className="col">
          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Word bank</h2>
              <span className="panel__meta">High-frequency first</span>
            </div>
            <div className="rows">
              <Bar label="High-Frequency Words" value={hfDone} total={BY_DECK.hf.length} tone="blue" />
              <Bar label="Common 1000 Words" value={cmDone} total={BY_DECK.cm.length} tone="purple" />
              <Bar label="Mastered" value={mastered} total={hfDone + cmDone} tone="green" />
            </div>
            <Link to="/words" className="panel__foot">
              View all <Icon name="arrow" size={14} />
            </Link>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Questions answered</h2>
              <span className="panel__meta">Last 7 days</span>
            </div>
            <div className="week">
              {week.map((w) => (
                <div key={w.label} className="week__col" title={`${w.count} answered`}>
                  <div className="week__track">
                    <i className={w.today ? 'is-today' : ''} style={{ height: `${Math.max(3, (100 * w.count) / maxCount)}%` }} />
                  </div>
                  <span className={w.today ? 'is-today' : ''}>{w.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col">
          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">
                Today, <span>{`${today.toLocaleDateString('en-US', { weekday: 'long' })} ${today.getDate()}`}</span>
              </h2>
            </div>
            <div className="tasks">
              <div className={`task ${doneToday ? '' : 'task--now'}`}>
                <div className="task__title">Learn {WORDS_PER_DAY} new words</div>
                <div className="task__meta">{doneToday ? 'Done' : `${learnedToday} of ${WORDS_PER_DAY} learned`}</div>
              </div>
              <div className="task tone-purple">
                <div className="task__title">{due ? `Review ${due} due ${due === 1 ? 'word' : 'words'}` : 'Nothing due to review'}</div>
                <div className="task__meta">{due ? 'Keep them fresh' : 'Check back tomorrow'}</div>
              </div>
              <div className="task tone-teal">
                <div className="task__title">Roots & Affixes</div>
                <div className="task__meta">Decode words you have never seen</div>
              </div>
            </div>
          </section>

          <section className="panel panel--tint">
            <div className="panel__head">
              <h2 className="panel__title">Progress</h2>
            </div>
            <div className="figures">
              <div>
                <div className="figures__n num">
                  <Icon name="flame" size={20} /> {streak(state)}
                </div>
                <div className="figures__l">day streak</div>
              </div>
              <div>
                <div className="figures__n num">{state.xp.toLocaleString()}</div>
                <div className="figures__l">total XP</div>
              </div>
              <div>
                <div className="figures__n num">{state.total ? `${accuracy}%` : '—'}</div>
                <div className="figures__l">accuracy</div>
              </div>
            </div>
            <Bar label="Today's XP" value={day.xp} total={XP_DAILY_GOAL} tone="orange" />
          </section>
        </div>
      </div>

      {pickNew(state, 1).length === 0 && (
        <div className="notice notice--good">You have introduced every word in the bank. Use Study and Review to lock them in.</div>
      )}
    </div>
  );
}
