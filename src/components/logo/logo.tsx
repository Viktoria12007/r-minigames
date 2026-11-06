import { Link } from 'react-router';

export default function Logo() {
  return (
    <Link className="logo" to="/" aria-label="MiniGames home">
      <div className="logo__icon"></div>
      <div>MiniGames</div>
    </Link>
  );
}
