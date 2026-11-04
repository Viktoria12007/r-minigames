import Logo from '../logo/logo.tsx';
import { checkAppSession } from '../../shared/session.ts';
import { Link, NavLink } from 'react-router';
import useIsHomeActive from '../../hooks/use-is-home-active.ts';

function closeBurgerMenu() {
  document.querySelector('.burger-menu_open')?.classList.remove('burger-menu_open');
}

export default function BurgerMenu() {
  const isHomeActive = useIsHomeActive();
  const session = checkAppSession().session;

  return (
    <div className="burger-menu">
      <div className="burger-menu__header">
        <Logo />
        <button className="close-burger" aria-label="Close menu" onClick={closeBurgerMenu}>
          <span />
        </button>
      </div>
      <nav className="burger-menu__navigation" aria-label="Primary navigation">
        <ul className="burger-menu__list">
          <li className="burger-menu__item">
            <Link
              to="/"
              className={`burger-menu__link ${isHomeActive ? 'active' : ''}`}
              aria-current={isHomeActive ? 'page' : undefined}
            >
              Home
            </Link>
          </li>
          <li className="burger-menu__item">
            <NavLink to="library" className="burger-menu__link">
              Library
            </NavLink>
          </li>
          <li className="burger-menu__item">
            <NavLink to="tournaments" className="burger-menu__link">
              Tournaments
            </NavLink>
          </li>
          <li className="burger-menu__item">
            <NavLink to="community" className="burger-menu__link">
              Community
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="burger-menu__actions">
        {session ? (
          <>
            <button className="burger-menu__button button button_ghost-white">Log Out</button>
          </>
        ) : (
          <>
            <button className="burger-menu__button button button_ghost-white">Log In</button>
            <button className="burger-menu__button button">Sign Up</button>
          </>
        )}
      </div>
    </div>
  );
}
