import { Link } from 'react-router-dom';
import Icon from './Icon';

/** Number card with a footer action. Footer is a router link (`to`) or a button (`onClick`). */
export default function StatCard({ label, value, tone, icon, cta, to, onClick, disabled }) {
  const footer = (
    <>
      {cta} <Icon name="arrow" size={14} />
    </>
  );
  return (
    <div className={`stat tone-${tone}`}>
      <div className="stat__body">
        <div>
          <div className="stat__label">{label}</div>
          <div className="stat__value num">{value}</div>
        </div>
        <span className={`stat__icon stat__icon--${tone}`}>
          <Icon name={icon} size={20} />
        </span>
      </div>
      {to ? (
        <Link to={to} className="stat__link">
          {footer}
        </Link>
      ) : (
        <button type="button" className="stat__link" onClick={onClick} disabled={disabled}>
          {footer}
        </button>
      )}
    </div>
  );
}
