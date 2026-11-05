import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__title">404 — Page not found</h1>
      <p className="not-found__text">The page you requested does not exist.</p>
      <Link className="button not-found__button" to="/">
        Return to Home Page
      </Link>
    </div>
  );
}
