import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import SnackbarContainer from '../components/snackbar-container/snackbar-container.tsx';
import { SnackbarContext } from '../context/snackbar-context.tsx';
import type { SnackbarData, SnackbarVariant } from '../types/types.ts';

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbars, setSnackbars] = useState<SnackbarData[]>([]);

  const showSnackbar = useCallback((text: string, variant: SnackbarVariant) => {
    const snackbar: SnackbarData = {
      id: crypto.randomUUID(),
      text,
      variant,
    };

    setSnackbars((previous) => [...previous, snackbar]);
  }, []);

  const hideSnackbar = useCallback((id: string) => {
    setSnackbars((previous) => previous.filter((snackbar) => snackbar.id !== id));
  }, []);

  const clearSnackbars = useCallback(() => {
    setSnackbars([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      showSnackbar,
      hideSnackbar,
      clearSnackbars,
    }),
    [showSnackbar, hideSnackbar, clearSnackbars],
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <SnackbarContainer snackbars={snackbars} onClose={hideSnackbar} />
    </SnackbarContext.Provider>
  );
}
