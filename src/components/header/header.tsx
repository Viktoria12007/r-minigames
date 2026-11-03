import getLinks from '../../shared/get-header-links.ts';
import Logo from '../logo/logo.tsx';
import Profile from '../profile/profile.tsx';
import { checkAppSession } from '../../shared/session.ts';

export default function Header() {
  const session = checkAppSession().session;
  return (
    <header className="header container">
      <Logo />
      <nav className="header__nav" aria-label="Primary navigation">
        <ul className="header__list">
          {getLinks().map((link) => (
            <li key={link.href} className="header__item">
              <a href={link.href} className={`header__link ${link.className}`}>
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="header__actions">
        {session ? (
          <>
            <Profile session={session} />
            <button className="button button_ghost">Log Out</button>
          </>
        ) : (
          <>
            <button className="button button_ghost">Log In</button>
            <button className="button">Sign Up</button>
          </>
        )}
      </div>
      <button className="burger" aria-label="Open menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
