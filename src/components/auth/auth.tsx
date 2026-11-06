import { useState } from 'react';
import type { AuthMode } from '../../types/types.ts';

interface IAuthProperties {
  outAuthMode: AuthMode;
}

export default function Auth({ outAuthMode }: IAuthProperties) {
  const [authMode, setAuthMode] = useState<AuthMode>(outAuthMode);

  return (
    <div className="auth">
      <div className="auth__tabs">
        <button
          className={`auth__tabs-button ${authMode === 'login' ? 'is-active' : ''}`}
          onClick={() => {
            setAuthMode('login');
          }}
        >
          Login
        </button>
        <button
          className={`auth__tabs-button ${authMode === 'register' ? 'is-active' : ''}`}
          onClick={() => {
            setAuthMode('register');
          }}
        >
          Register
        </button>
      </div>
      <div className="auth__content">
        {authMode === 'login' ? (
          <>
            <h2 className="auth__title" id="dialog-title">
              Welcome Back!
            </h2>
            <p className="auth__content-lead">Sign in to resume your games and progress.</p>
            <form className="auth__form">
              <label className="auth__label">
                Email Address
                <input
                  className="auth__input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required={true}
                  placeholder="e.g. alex@minigames.com"
                />
                <span className="auth__error" aria-live="polite" data-errorfor="username"></span>
              </label>
              <label className="auth__label">
                Password
                <input
                  className="auth__input"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required={true}
                  placeholder="••••••••"
                />
                <span className="auth__error" aria-live="polite" data-errorfor="username"></span>
              </label>
              <a className="auth__forgot" href="#forgot">
                Forgot Password?
              </a>
              <button className="button button--full auth__button" type="submit" disabled={true}>
                Login
              </button>
            </form>
            <div className="auth__divider">OR</div>
            <button className="button auth__button-google">
              <div className="auth__google-icon"></div>
              Continue with Google
            </button>
            <p className="auth__switch">
              {`Don't have an account? `}
              <button
                className="auth__switch-button"
                onClick={() => {
                  setAuthMode('register');
                }}
              >
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="auth__title" id="dialog-title">
              Create Account
            </h2>
            <p className="auth__content-lead">Join MiniGames to track your score & streak.</p>
            <form className="auth__form">
              <label className="auth__label">
                Username
                <input
                  className="auth__input"
                  type="text"
                  name="username"
                  autoComplete="username"
                  required={true}
                  placeholder="e.g. CozyGamer99"
                />
                <span className="auth__error" aria-live="polite" data-errorfor="username"></span>
              </label>
              <label className="auth__label">
                Email Address
                <input
                  className="auth__input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required={true}
                  placeholder="e.g. alex@minigames.com"
                />
                <span className="auth__error" aria-live="polite" data-errorfor="username"></span>
              </label>
              <label className="auth__label">
                Password
                <input
                  className="auth__input"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required={true}
                  placeholder="Min. 6 characters"
                />
                <span className="auth__error" aria-live="polite" data-errorfor="username"></span>
              </label>
              <label className="auth__label">
                Confirm Password
                <input
                  className="auth__input"
                  type="password"
                  name="confirm-password"
                  autoComplete="new-password"
                  required={true}
                  placeholder="Repeat your password"
                />
                <span className="auth__error" aria-live="polite" data-errorfor="username"></span>
              </label>
              <button className="button button--full auth__button" type="submit" disabled={true}>
                Create Account
              </button>
            </form>
            <div className="auth__divider">OR</div>
            <button className="button auth__button-google">
              <div className="auth__google-icon"></div>
              Sign up with Google
            </button>
            <p className="auth__switch">
              {`Already have an account? `}
              <button
                className="auth__switch-button"
                onClick={() => {
                  setAuthMode('login');
                }}
              >
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
