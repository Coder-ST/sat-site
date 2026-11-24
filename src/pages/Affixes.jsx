import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import { AFFIX_DECKS, BY_DECK, DECKS } from '../lib/decks';
import { shuffle } from '../lib/utils';

const TONES = { roots: 'orange', prefixes: 'teal', suffixes: 'rose' };

export default function Affixes() {
  const navigate = useNavigate();
  const quiz = (deck) =>
    navigate('/quiz', {
      state: { ids: shuffle(BY_DECK[deck]).slice(0, 20).map((x) => x.id), title: `${DECKS[deck].name} quiz`, mode: 'practice' },
    });

  return (
    <div className="stack">
      <PageHeader title="Roots, Prefixes & Suffixes">Learn the pieces and you can decode words you've never seen.</PageHeader>
      <div className="split split--top">
        {[['roots'], ['prefixes', 'suffixes']].map((group, gi) => (
          <div key={gi} className="col">
        {group.map((d) => (
          <section key={d} className={`panel tone-${TONES[d]}`}>
            <div className="panel__head" style={{ paddingBlock: 12 }}>
              <h2 className="panel__title">
                {DECKS[d].name} <span className="muted num">{BY_DECK[d].length}</span>
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" variant="primary" to={`/cards/${d}`}>
                  Cards
                </Button>
                <Button size="sm" onClick={() => quiz(d)}>
                  Quiz
                </Button>
              </div>
            </div>
            <ul className="list list--tight">
              {BY_DECK[d].map((x) => (
                <li key={x.id}>
                  <div className="list__main">
                    <div className="list__word">
                      <span className="accent">{x.w}</span> <span style={{ fontWeight: 500, color: 'var(--ink-2)' }}>· {x.d}</span>
                    </div>
                    <div className="list__sub">{x.e}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
          </div>
        ))}
      </div>
    </div>
  );
}
