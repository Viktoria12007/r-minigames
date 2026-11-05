import Logo from '../logo/logo.tsx';
import Profile from '../profile/profile.tsx';
import { checkAppSession } from '../../shared/session.ts';
import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import useIsHomeActive from '../../hooks/use-is-home-active.ts';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isHomeActive = useIsHomeActive();

  const session = checkAppSession().session;

  function toggleBurgerMenu() {
    setIsOpen(!isOpen);
    document.querySelector('.burger-menu')?.classList.toggle('burger-menu_open');
  }
  return (
    <header className="header container">
      <Logo />
      <nav className="header__nav" aria-label="Primary navigation">
        <ul className="header__list">
          <li className="header__item">
            <Link
              to="/"
              className={`header__link ${isHomeActive ? 'active' : ''}`}
              aria-current={isHomeActive ? 'page' : undefined}
            >
              Home
            </Link>
          </li>
          <li className="header__item">
            <NavLink to="library" className="header__link">
              Library
            </NavLink>
          </li>
          <li className="header__item">
            <NavLink to="tournaments" className="header__link">
              Tournaments
            </NavLink>
          </li>
          <li className="header__item">
            <NavLink to="community" className="header__link">
              Community
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="header__actions">
        {session ? (
          <>
            <Profile session={session} />
            <button className="header__button button button_ghost">Log Out</button>
          </>
        ) : (
          <>
            <button className="header__button button button_ghost">Log In</button>
            <button className="header__button button">Sign Up</button>
          </>
        )}
      </div>
      <button
        className="burger"
        aria-label="Open menu"
        aria-expanded={isOpen}
        onClick={toggleBurgerMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
