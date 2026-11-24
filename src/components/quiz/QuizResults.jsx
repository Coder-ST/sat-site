import Button from '../ui/Button';
import { BY_ID } from '../../lib/decks';
import { pct } from '../../lib/utils';

function message(p) {
  if (p === 100) return 'Perfect round.';
  if (p >= 80) return 'Strong. These are sticking.';
  if (p >= 60) return 'Decent. The missed ones will come back tomorrow.';
  return 'Rough one, but that is how it sticks. Missed words return tomorrow.';
}

export default function QuizResults({ stepper, ids, results, xpGained, again, onRetryMissed, onHome }) {
  const right = ids.filter((id) => results[id]).length;
  const missed = ids.filter((id) => !results[id]);
  const score = pct(right, ids.length);

  return (
    <div className="content--narrow stack">
      {stepper}
      <section className="q q--results">
        <div className="eyebrow">Round complete</div>
        <div className="q__score num">
          {right}
          <span>/{ids.length}</span>
        </div>
        <div className="q__summary num">
          {score}% first try · +{xpGained} XP
        </div>
        <p className="q__message">{message(score)}</p>

        {missed.length > 0 && (
          <div className="missed">
            <div className="eyebrow">Missed</div>
            <ul>
              {missed.map((id) => (
                <li key={id}>
                  <strong>{BY_ID[id].w}</strong>
                  <span>{BY_ID[id].d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="study-controls">
          {missed.length > 0 && <Button onClick={() => onRetryMissed(missed)}>Quiz missed ({missed.length})</Button>}
          {again && (
            <Button variant="primary" onClick={again.onClick}>
              {again.label}
            </Button>
          )}
          <Button variant={again ? 'default' : 'primary'} onClick={onHome}>
            Back to Home
          </Button>
        </div>
      </section>
    </div>
  );
}
