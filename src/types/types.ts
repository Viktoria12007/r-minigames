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

export type Leader = {
  rank: number;
  playerName: string;
  gamesPlayed: number;
  totalScore: number;
  streakDays: number;
  favoriteGameName: string;
};

export type Status = 'loading' | 'empty' | 'error';

export type SnackbarVariant = 'success' | 'error';

export interface SnackbarData {
  id: string;
  text: string;
  variant: SnackbarVariant;
}

export type FeaturedGame = {
  slug: string;
  name: string;
  cardImage: string;
  rating: number;
  likesCount: number;
};
