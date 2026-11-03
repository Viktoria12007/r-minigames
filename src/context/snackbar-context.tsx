import { createContext } from 'react';
import type { SnackbarVariant } from '../types/types.ts';

type SnackbarContextType = {
  showSnackbar: (message: string, type: SnackbarVariant) => void;
  hideSnackbar: (id: string) => void;
  clearSnackbars: () => void;
};

export const SnackbarContext = createContext<SnackbarContextType | null>(null);
