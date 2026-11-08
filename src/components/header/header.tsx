import Logo from '../logo/logo.tsx';
import Profile from '../profile/profile.tsx';
import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import useIsHomeActive from '../../hooks/use-is-home-active.ts';
import useModalWindow from '../../hooks/use-modal-window.ts';
import Auth from '../auth/auth.tsx';
import BurgerMenu from '../burger-menu/burger-menu.tsx';
import useSession from '../../hooks/use-session.ts';
import useLogout from '../../hooks/use-logout.ts';

export default function Header() {
  const { session } = useSession();
  const handleLogout = useLogout();
  const { openModalWindow } = useModalWindow();

  // const session = checkAppSession().session;

  const [isOpenBurgerMenu, setIsOpenBurgerMenu] = useState(false);
  const isHomeActive = useIsHomeActive();

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
            <button
              className="header__button button button_ghost"
              data-logout={true}
              onClick={handleLogout}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <button
              className="header__button button button_ghost"
              data-auth="login"
              onClick={() =>
                openModalWindow({ children: <Auth outAuthMode="login" />, wide: false })
              }
            >
              Log In
            </button>
            <button
              className="header__button button"
              data-auth="register"
              onClick={() =>
                openModalWindow({ children: <Auth outAuthMode="register" />, wide: false })
              }
            >
              Sign Up
            </button>
          </>
        )}
      </div>
      <button
        className="burger"
        aria-label="Open menu"
        aria-expanded={isOpenBurgerMenu}
        onClick={() => setIsOpenBurgerMenu(!isOpenBurgerMenu)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <BurgerMenu isOpen={isOpenBurgerMenu} onClose={() => setIsOpenBurgerMenu(false)} />
    </header>
  );
}
