import { createContext } from 'react';
import type { AppSession, SessionCheck } from '../types/types.ts';
import type { User } from 'firebase/auth';

type SessionContextType = {
  createAppSession: (user: User) => AppSession;
  checkAppSession: (now?: number) => SessionCheck;
  clearAppSession: () => Promise<void>;
  refreshAppSession: () => SessionCheck;
  session: AppSession | null;
};

export const SessionContext = createContext<SessionContextType | null>(null);
