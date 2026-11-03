export type AppSession = {
  displayName: string;
  email: string;
  authenticatedAt: number;
  avatarUrl?: string;
};

export type SessionStatus = 'active' | 'expired' | 'invalid' | 'guest';

export type SessionCheck = {
  status: SessionStatus;
  session?: AppSession;
};
