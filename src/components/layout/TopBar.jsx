import Icon from '../ui/Icon';

export default function TopBar({ onMenu }) {
  return (
    <header className="topbar">
      <button type="button" className="topbar__menu" onClick={onMenu} aria-label="Open menu">
        <Icon name="menu" size={20} />
      </button>
    </header>
  );
}
