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

export type Status = 'loading' | 'empty' | 'error' | 'success';

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

export type Category = { slug: string; label: string; isDefault: boolean };

export type LibraryGame = {
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  rating: number;
  likesCount: number;
  cardImage: string;
};

export type GamesMeta = {
  page: number;
  totalPages: number;
};

export type GameDetails = {
  slug: string;
  name: string;
  heroImage: string;
  rating: number;
  likesCount: number;
  isLikedByCurrentUser?: boolean;
  fullDescription: string;
  specs: Record<string, string>;
  topRecords: Array<{
    position: number;
    playerName: string;
    score: number;
    achievedAt: string;
  }>;
};

export type AuthMode = 'login' | 'register';
