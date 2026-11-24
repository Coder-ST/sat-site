import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import QuizRunner from '../components/quiz/QuizRunner';
import { BY_ID } from '../lib/decks';

/**
 * Generic quiz route. Launch with navigate('/quiz', { state: { ids, title, mode } }).
 */
export default function QuizPage() {
  const { state: launch } = useLocation();
  const navigate = useNavigate();
  const [run, setRun] = useState(() => (launch ? { ...launch, key: 0 } : null));

  if (!run) return <Navigate to="/" replace />;
  const items = run.ids.map((id) => BY_ID[id]).filter(Boolean);

  return (
    <QuizRunner
      key={run.key}
      items={items}
      title={run.title}
      mode={run.mode}
      onRetryMissed={(missed) => setRun({ ids: missed, title: 'Missed words', mode: 'practice', key: run.key + 1 })}
      onHome={() => navigate('/')}
    />
  );
}
