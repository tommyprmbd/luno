type HeaderProps = {
  onOpenSettings: () => void;
};

function Header({ onOpenSettings }: HeaderProps) {
  return (
    <header className="header">
      <h1>Luno</h1>

      <button
        type="button"
        className="settings-button"
        onClick={onOpenSettings}
      >
        Settings
      </button>
    </header>
  );
}
export default Header;
