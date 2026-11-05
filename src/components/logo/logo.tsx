import { Link } from 'react-router';
import { baseUrl } from '../../shared/base-url.ts';

export default function Logo() {
  return (
    <Link className="logo" to={baseUrl} aria-label="MiniGames home">
      <div className="logo__icon"></div>
      <div>MiniGames</div>
    </Link>
  );
}
