import { useState } from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import PageHeader from '../ui/PageHeader';
import ProgressBar from '../ui/ProgressBar';
import { POS_LABELS } from '../../lib/constants';
import { isAffix } from '../../lib/decks';
import { highlightParts, speak } from '../../lib/text';
import { shuffle } from '../../lib/utils';
import { useKey } from '../../hooks/useKey';
import './flashcards.css';

function Example({ item }) {
  if (isAffix(item)) {
    return (
      <p className="fc-example">
        Examples: <strong>{item.e}</strong>
      </p>
    );
  }
  return (
    <p className="fc-example">
      {highlightParts(item.e, item.w).map((p, i) => (p.hit ? <mark key={i}>{p.text}</mark> : p.text))}
    </p>
  );
}

/**
 * Flip-through card deck.
 * `finalAction` replaces the "Next" button on the last card (used by the daily session to start the quiz).
 */
export default function FlashcardViewer({ items: initial, title, finalAction, onQuiz, header }) {
  const [items, setItems] = useState(initial);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const item = items[i];
  const last = i === items.length - 1;
  const affix = isAffix(item);

  const go = (n) => {
    setI(n);
    setFlipped(false);
  };
  const next = () => !last && go(i + 1);
  const prev = () => i > 0 && go(i - 1);
  const flip = () => setFlipped((f) => !f);

  useKey((e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      flip();
    } else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });

  return (
    <div className="content--narrow stack">
      <PageHeader title={title} />
      {header}
      <div>
        <div className="study-count">
          <span>
            Card {i + 1} of {items.length}
          </span>
        </div>
        <ProgressBar value={(100 * (i + 1)) / items.length} label="Deck progress" className="study-bar" />
      </div>

      <div className="fc-stage">
        <div
          className="fc"
          onClick={flip}
          role="button"
          tabIndex={0}
          aria-label={flipped ? 'Showing definition. Press to show word.' : 'Showing word. Press to show definition.'}
        >
          <div className={`fc__inner ${flipped ? 'is-flipped' : ''}`}>
            <div className="fc__face">
              <button
                type="button"
                className="fc__speak"
                aria-label="Pronounce"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(item.w.replace(/[-/]/g, ' '));
                }}
              >
                <Icon name="vol" size={18} />
              </button>
              <div className="eyebrow">{affix ? POS_LABELS[item.p] : 'Word'}</div>
              <div className="fc__word">{item.w}</div>
              {!affix && <div className="fc__pos">{POS_LABELS[item.p]}</div>}
              <div className="fc__hint">
                <Icon name="flip" size={14} /> Tap or press space to flip
              </div>
            </div>
            <div className="fc__face fc__face--back">
              <div className="eyebrow">
                {item.w}
                {!affix && ` · ${POS_LABELS[item.p]}`}
              </div>
              <div className="fc__defn">{item.d}</div>
              <Example item={item} />
            </div>
          </div>
        </div>

        <div className="study-controls">
          <Button onClick={prev} disabled={i === 0}>
            <Icon name="left" /> Back
          </Button>
          <Button onClick={flip}>Flip</Button>
          {last && finalAction ? (
            <Button variant="primary" onClick={finalAction.onClick}>
              {finalAction.label} <Icon name="arrow" />
            </Button>
          ) : (
            <Button variant="primary" onClick={next} disabled={last}>
              Next <Icon name="arrow" />
            </Button>
          )}
        </div>

        {onQuiz && (
          <div className="study-controls study-controls--secondary">
            <Button size="sm" variant="ghost" onClick={() => { setItems(shuffle(items)); go(0); }}>
              <Icon name="shuffle" size={16} /> Shuffle
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onQuiz(items)}>
              <Icon name="quiz" size={16} /> Quiz this deck
            </Button>
          </div>
        )}

        <p className="study-keys">
          <kbd>Space</kbd> flip · <kbd>←</kbd> <kbd>→</kbd> move
        </p>
      </div>
    </div>
  );
}
