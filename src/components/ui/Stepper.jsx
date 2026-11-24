import Icon from './Icon';

const STEPS = ['Flashcards', 'Quiz', 'Results'];

/** `current` is the 0-based active step; earlier steps show as done. */
export default function Stepper({ current }) {
  return (
    <ol className="stepper" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {STEPS.map((label, i) => {
        const state = i < current ? 'is-done' : i === current ? 'is-active' : '';
        return (
          <li key={label} className={`stepper__step ${state}`} aria-current={i === current ? 'step' : undefined}>
            <span className="stepper__num">{i < current ? <Icon name="check" size={12} strokeWidth={3} /> : i + 1}</span>
            <span className="stepper__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
