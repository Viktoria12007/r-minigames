import Logo from '../logo/logo.tsx';
import { Link, NavLink } from 'react-router';
import useIsHomeActive from '../../hooks/use-is-home-active.ts';
import useModalWindow from '../../hooks/use-modal-window.ts';
import Auth from '../auth/auth.tsx';
import type { MouseEvent } from 'react';
import useSession from '../../hooks/use-session.ts';
import useLogout from '../../hooks/use-logout.ts';

interface IBurgerMenuProperties {
  isOpen: boolean;
  onClose: () => void;
}

export default function BurgerMenu({ isOpen, onClose }: IBurgerMenuProperties) {
  const { session } = useSession();
  const handleLogout = useLogout();
  const { openModalWindow } = useModalWindow();
  const isHomeActive = useIsHomeActive();

  // const session = checkAppSession().session;

  function onLogin() {
    openModalWindow({ children: <Auth outAuthMode="login" />, wide: false });
    onClose();
  }

  function onSignup() {
    openModalWindow({ children: <Auth outAuthMode="register" />, wide: false });
    onClose();
  }

  function onNavClick(event: MouseEvent<HTMLElement>) {
    const target = event.target;
    if (target instanceof Element && target.closest('a[href]')) {
      onClose();
    }
  }

  return (
    <div className={`burger-menu ${isOpen ? 'is-open' : ''}`}>
      <div className="burger-menu__header">
        <Logo />
        <button className="close-burger" aria-label="Close menu" onClick={onClose}>
          <span />
        </button>
      </div>
      <nav
        className="burger-menu__navigation"
        aria-label="Primary navigation"
        onClick={(event) => onNavClick(event)}
      >
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
          <button
            className="burger-menu__button button button_ghost-white"
            data-logout={true}
            onClick={handleLogout}
          >
            Log Out
          </button>
        ) : (
          <>
            <button
              className="burger-menu__button button button_ghost-white"
              data-auth="login"
              onClick={onLogin}
            >
              Log In
            </button>
            <button className="burger-menu__button button" data-auth="register" onClick={onSignup}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
}
