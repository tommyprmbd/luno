type HeaderProps = {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
};

function Header({ onOpenHistory, onOpenSettings }: HeaderProps) {
  return (
    <header className="header">
      <h1>Luno</h1>

      <div className="header-actions">
        <button
          type="button"
          className="header-button"
          onClick={onOpenHistory}
        >
          History
        </button>

        <button
          type="button"
          className="header-button"
          onClick={onOpenSettings}
        >
          Settings
        </button>
      </div>
    </header>
  );
}
export default Header;
