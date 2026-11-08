import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.scss';
import App from './app.tsx';
import { SnackbarProvider } from './provider/snackbar-provider.tsx';
import SessionProvider from './provider/session-provider.tsx';

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <SnackbarProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
    </SnackbarProvider>
  </StrictMode>,
);
