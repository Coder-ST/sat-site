import { Link } from 'react-router-dom';

/** Renders a <button>, or a router <Link> when `to` is given. */
export default function Button({ variant = 'default', size, to, className = '', children, ...rest }) {
  const cls = ['btn', variant !== 'default' && `btn--${variant}`, size && `btn--${size}`, className]
    .filter(Boolean)
    .join(' ');
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
