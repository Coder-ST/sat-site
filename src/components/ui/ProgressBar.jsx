export default function ProgressBar({ value, tone, label, className = '' }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`bar ${tone ? `bar--${tone}` : ''} ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <i style={{ width: `${v}%` }} />
    </div>
  );
}
