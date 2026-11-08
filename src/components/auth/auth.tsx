import {useState} from 'react';
import type {AuthErrors, AuthMode} from '../../types/types.ts';
import {registerWithEmail, signInWithEmail, signInWithGoogle} from "../../shared/firebase.ts";
import {useSnackbar} from "../../hooks/use-snackbar.ts";
import type {SubmitEvent} from "react";
import useModalWindow from "../../hooks/use-modal-window.ts";
import {validateAuthFields} from "../../shared/validation.ts";
import useSession from "../../hooks/use-session.ts";

interface IAuthProperties {
  outAuthMode: AuthMode;
}

export default function Auth({ outAuthMode }: IAuthProperties) {
    const { createAppSession } = useSession();
    const { showSnackbar } = useSnackbar();
    const { closeModalWindow } = useModalWindow();

  const [authMode, setAuthMode] = useState<AuthMode>(outAuthMode);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<AuthErrors>({});

  function switchMode(mode: AuthMode) {
      setAuthMode(mode);
      setFormValues({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
      });
  }

  function handleChangeInput(field: Record<string, string>) {
      setFormValues((previously) => ({ ...previously, ...field }));
      handleValidationInput();
  }

  function handleValidationInput() {
      // renderValidation();
      setValidationErrors(validateAuthFields(authMode, formValues));
  }

  async function handleSubmitByEmail(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      // renderValidation();
      setValidationErrors(validateAuthFields(authMode, formValues));
      if (isPending) return;
      setIsPending(true);
      try {
          const user = authMode === 'login'
              ? await signInWithEmail(formValues.email, formValues.password)
              : await registerWithEmail(
                  formValues.email,
                  formValues.password,
                  formValues.username ?? '',
              );
          createAppSession(user);
          showSnackbar(`Welcome${user.displayName ? `, ${user.displayName}` : ''}!`, 'success');
          setIsPending(false);
          closeModalWindow();
      } catch (error) {
          showSnackbar(
              error instanceof Error ? error.message : 'Authentication failed. Please try again.',
              'error',
          );
      } finally {
          setIsPending(false);
          // renderValidation();
          setValidationErrors(validateAuthFields(authMode, formValues));
      }
  }

  async function submitByGoogle() {
      if (isPending) return;
      setIsPending(true);
      try {
          const user = await signInWithGoogle();
          createAppSession(user);
          showSnackbar(`Welcome${user.displayName ? `, ${user.displayName}` : ''}!`, 'success');
          setIsPending(false);
          closeModalWindow();
      } catch (error) {
          showSnackbar(
              error instanceof Error ? error.message : 'Google sign-in was not completed.',
              'error',
          );
      } finally {
          setIsPending(false);
      }
  }

  return (
    <div className="auth">
      <div className="auth__tabs">
        <button
          className={`auth__tabs-button ${authMode === 'login' ? 'is-active' : ''}`}
          onClick={() => switchMode('login')}
        >
          Login
        </button>
        <button
          className={`auth__tabs-button ${authMode === 'register' ? 'is-active' : ''}`}
          onClick={() => switchMode('register')}
        >
          Register
        </button>
      </div>
      <div className="auth__content">
            <h2 className="auth__title" id="dialog-title">
                { authMode === 'login' ? 'Welcome Back!' : 'Create Account' }
            </h2>
            <p className="auth__content-lead">
                {authMode === 'login'
                ? 'Sign in to resume your games and progress.'
                : 'Join MiniGames to track your score & streak.'}
            </p>
            <form className="auth__form" onSubmit={(event) => handleSubmitByEmail(event)}>
                { authMode === 'register' && (
                    <label className="auth__label">
                    Username
                    <input
                        className="auth__input"
                        type="text"
                        name="username"
                        autoComplete="username"
                        required={true}
                        placeholder="e.g. CozyGamer99"
                        disabled={isPending}
                        aria-invalid={Boolean(validationErrors['username'])}
                        value={formValues.username}
                        onChange={(event) => handleChangeInput({ username: event.target.value })}
                        onInput={handleValidationInput}
                        onBlur={handleValidationInput}
                    />
                    <span className="auth__error" aria-live="polite">
                    { validationErrors['username'] }
                </span>
                </label>)}
                <label className="auth__label">
                Email Address
                <input
                  className="auth__input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required={true}
                  placeholder="e.g. alex@minigames.com"
                  disabled={isPending}
                  aria-invalid={Boolean(validationErrors['email'])}
                  value={formValues.email}
                  onChange={(event) => handleChangeInput({ email: event.target.value })}
                  onInput={handleValidationInput}
                  onBlur={handleValidationInput}
                />
                <span className="auth__error" aria-live="polite">
                    { validationErrors['email'] }
                </span>
              </label>
              <label className="auth__label">
                Password
                <input
                  className="auth__input"
                  type="password"
                  name="password"
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  required={true}
                  placeholder={authMode === 'login' ? '••••••••' : 'Min. 6 characters'}
                  disabled={isPending}
                  aria-invalid={Boolean(validationErrors['password'])}
                  value={formValues.password}
                  onChange={(event) => handleChangeInput({ password: event.target.value })}
                  onInput={handleValidationInput}
                  onBlur={handleValidationInput}
                />
                <span className="auth__error" aria-live="polite">
                    { validationErrors['password'] }
                </span>
              </label>
                { authMode === 'login' ? <a className="auth__forgot" href="#forgot">
                Forgot Password?
              </a> :
                    <label className="auth__label">
                        Confirm Password
                        <input
                            className="auth__input"
                            type="password"
                            name="confirm-password"
                            autoComplete="new-password"
                            required={true}
                            placeholder="Repeat your password"
                            disabled={isPending}
                            aria-invalid={Boolean(validationErrors['confirmPassword'])}
                            value={formValues.confirmPassword}
                            onChange={(event) => handleChangeInput({ confirmPassword: event.target.value })}
                            onInput={handleValidationInput}
                            onBlur={handleValidationInput}
                        />
                        <span className="auth__error" aria-live="polite">
                    { validationErrors['confirmPassword'] }
                </span>
                    </label>
                }
              <button
                  className="button button--full auth__button"
                  type="submit"
                  disabled={Object.keys(validationErrors).length > 0 || isPending}
              >
                  { authMode === 'login' ? 'Login' : 'Create Account' }
              </button>
            </form>
            <div className="auth__divider">OR</div>
            <button className="button auth__button-google" onClick={submitByGoogle}>
              <div className="auth__google-icon"></div>
                { authMode === 'login' ? 'Continue with Google' : 'Sign up with Google' }
            </button>
            <p className="auth__switch">
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                className="auth__switch-button"
                onClick={() => {
                    switchMode(authMode === 'login' ? 'register' : 'login')
                }}
              >
                  { authMode === 'login' ? 'Register' : 'Login' }
              </button>
            </p>
      </div>
    </div>
  );
}
