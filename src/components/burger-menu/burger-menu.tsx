import Logo from '../logo/logo.tsx';
import getHeaderLinks from '../../shared/get-header-links.ts';
import { checkAppSession } from '../../shared/session.ts';

function closeBurgerMenu() {
  document.querySelector('.burger-menu_open')?.classList.remove('burger-menu_open');
}

export default function BurgerMenu() {
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
          {getHeaderLinks().map((link) => (
            <li key={link.text} className="burger-menu__item">
              <a className={`burger-menu__link ${link.className}`} href={link.href}>
                {link.text}
              </a>
            </li>
          ))}
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
