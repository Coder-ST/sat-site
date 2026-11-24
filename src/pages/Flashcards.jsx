import { Navigate, useNavigate, useParams } from 'react-router-dom';
import FlashcardViewer from '../components/flashcards/FlashcardViewer';
import { useProgress } from '../hooks/ProgressContext';
import { BY_DECK, LEARNED, deckTitle } from '../lib/decks';
import { learnedItems } from '../lib/srs';
import { shuffle } from '../lib/utils';

export function useDeckItems(key, state) {
  return key === LEARNED ? learnedItems(state) : BY_DECK[key] || [];
}

/** /cards/:deck — flip through a deck. */
export function DeckViewer() {
  const { deck } = useParams();
  const { state } = useProgress();
  const navigate = useNavigate();
  const items = useDeckItems(deck, state);

  if (!items.length) return <Navigate to="/study" replace />;

  return (
    <FlashcardViewer
      key={deck}
      items={items}
      title={deckTitle(deck)}
      onQuiz={(current) =>
        navigate('/quiz', {
          state: { ids: shuffle(current).slice(0, 20).map((x) => x.id), title: `${deckTitle(deck)} quiz`, mode: 'practice' },
        })
      }
    />
  );
}
