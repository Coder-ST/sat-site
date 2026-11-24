import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';
import { useProgress } from '../../hooks/ProgressContext';
import { dueIds } from '../../lib/srs';

export const NAV = [
  {
    group: 'Platform',
    items: [
      { to: '/', icon: 'home', label: 'Home', end: true },
      { to: '/session', icon: 'cap', label: 'Daily Session', badge: true },
    ],
  },
  {
    group: 'Explore & Learn',
    items: [
      { to: '/study', icon: 'cards', label: 'Study' },
      { to: '/affixes', icon: 'roots', label: 'Roots & Affixes' },
      { to: '/words', icon: 'list', label: 'Word List' },
    ],
  },
];

export default function Sidebar({ open, onNavigate }) {
  const { state } = useProgress();
  const due = dueIds(state).length;

  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Main navigation">
      <div className="brand">
        <div>
          <div className="brand__name">SAT</div>
          <div className="brand__sub">Vocab Trainer</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <div className="sidebar__group">{group}</div>
            {items.map(({ to, icon, label, end, badge }) => (
              <NavLink key={to} to={to} end={end} className="nav-link" onClick={onNavigate}>
                <Icon name={icon} size={19} />
                <span>{label}</span>
                {badge && due > 0 && <span className="nav-link__badge num">{due}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

    </aside>
  );
}
