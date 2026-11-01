export default function Logo() {
  return (
    <a
      className="logo"
      href={import.meta.env?.BASE_URL ?? '/r-minigames/'}
      aria-label="MiniGames home"
    >
      <div className="logo__icon"></div>
      <div>MiniGames</div>
    </a>
  );
}
