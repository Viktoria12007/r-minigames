import Logo from '../logo/logo.tsx';
import getFooterLinks from '../../shared/get-footer-links.ts';
import { Link, NavLink } from 'react-router';
import useIsHomeActive from '../../hooks/use-is-home-active.ts';

export default function Footer() {
  const isHomeActive = useIsHomeActive();

  const textBottom = [
    'В© 2026 MiniGames. All rights reserved.',
    'RS School',
    '@student-nickname',
    'Designed with love',
  ];

  return (
    <footer className="footer">
      <div className="footer__wrap container">
        <div className="footer__top">
          <div className="footer__intro">
            <Logo />
            <p className="footer__text">
              Take a short break and have fun. Hundreds of curated casual mini-games right in your
              web browser. No download required.
            </p>
          </div>
          <div className="footer__links">
            {getFooterLinks().map(([name, items]) => (
              <nav key={name} className="footer__group">
                <h3 className="footer__title">{name}</h3>
                <ul className={name === 'Community' ? 'footer__social-list' : 'footer__list'}>
                  {items.map(([text, href]) => (
                    <li
                      key={text}
                      className={name === 'Community' ? 'footer__social-item' : 'footer__item'}
                    >
                      {name === 'Community' ? (
                        <Link className="footer__social-link" to={href} aria-label={text}></Link>
                      ) : href === '/' ? (
                        <Link
                          className={`footer__link ${isHomeActive ? 'active' : ''}`}
                          aria-current={isHomeActive ? 'page' : undefined}
                          to={href}
                        >
                          {text}
                        </Link>
                      ) : (
                        <NavLink className="footer__link" to={href}>
                          {text}
                        </NavLink>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="footer__bottom">
          {textBottom.map((text) => {
            return text === 'RS School' || text === '@student-nickname' ? (
              <a
                key={text}
                className="footer__bottom-link"
                href="https://app.rs.school/"
                target="_blank"
              >
                <div
                  className={`footer__bottom-icon footer__bottom-icon_${text.replace('@', '').split(' ', 1)[0]}`}
                ></div>
                <span>{text}</span>
              </a>
            ) : (
              <span key={text}>{text}</span>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
