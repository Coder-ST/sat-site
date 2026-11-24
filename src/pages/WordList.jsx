import { useMemo, useState } from 'react';
import Icon from '../components/ui/Icon';
import PageHeader from '../components/ui/PageHeader';
import { useProgress } from '../hooks/ProgressContext';
import { POS_LABELS } from '../lib/constants';
import { BY_DECK } from '../lib/decks';

const LIMIT = 150;

export default function WordList() {
  const { state } = useProgress();
  const [query, setQuery] = useState('');
  const [deck, setDeck] = useState('all');

  const { rows, total } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = deck === 'all' ? [...BY_DECK.hf, ...BY_DECK.cm] : BY_DECK[deck];
    const hits = pool.filter((x) => !q || x.w.toLowerCase().includes(q) || x.d.toLowerCase().includes(q));
    return { rows: hits.slice(0, LIMIT), total: hits.length };
  }, [query, deck]);

  return (
    <div className="stack">
      <PageHeader eyebrow="Explore & learn" title="Word List">
        Search any word or definition.
      </PageHeader>

      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={18} />
          <input
            className="field"
            type="search"
            placeholder="Search words or definitions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search words"
          />
        </label>
        <select className="field" value={deck} onChange={(e) => setDeck(e.target.value)} aria-label="Filter by deck">
          <option value="all">All words</option>
          <option value="hf">High-Frequency</option>
          <option value="cm">Common 1000</option>
        </select>
      </div>

      <div className="card table-card fill">
        {rows.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Word</th>
                <th>Definition</th>
                <th aria-label="Status" />
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => {
                const w = state.words[x.id];
                return (
                  <tr key={x.id}>
                    <td>
                      <div className="table__word">{x.w}</div>
                      <div className="table__sub">{POS_LABELS[x.p]}</div>
                    </td>
                    <td>{x.d}</td>
                    <td style={{ textAlign: 'right' }}>
                      {w && (w.box >= 3 ? <span className="chip chip--mastered">mastered</span> : <span className="chip chip--learning">learning</span>)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty">No matches.</div>
        )}
        {total > LIMIT && (
          <div className="muted" style={{ padding: '12px 12px 16px', fontSize: 13 }}>
            Showing {LIMIT} of {total}. Refine your search.
          </div>
        )}
      </div>
    </div>
  );
}
