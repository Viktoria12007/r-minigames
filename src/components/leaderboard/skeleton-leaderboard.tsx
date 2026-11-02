import type { Status } from '../../types/types.ts';
import * as React from 'react';

interface ISkeletonLeaderboardProperties {
  status: Status;
  retry?: () => void;
}

export default function SkeletonLeaderboard({ status, retry }: ISkeletonLeaderboardProperties) {
  let content: React.ReactNode;
  switch (status) {
    case 'loading': {
      content = (
        <div
          className={`leaderboard__state leaderboard__state_${status}`}
          role="status"
          aria-label="Loading top players"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="leaderboard__skeleton"></div>
          ))}
        </div>
      );
      break;
    }
    case 'empty': {
      content = (
        <div
          className={`leaderboard__state leaderboard__state_${status}`}
          role="status"
          aria-label="Loading top players"
        >
          <p className="leaderboard__state-title">No top players yet</p>
          <p className="leaderboard__state-text">Player scores will appear here soon.</p>
        </div>
      );
      break;
    }
    case 'error': {
      content = (
        <div
          className={`leaderboard__state leaderboard__state_${status}`}
          role="status"
          aria-label="Loading top players"
        >
          <p className="leaderboard__state-title">Could not load top players</p>
          <p className="leaderboard__state-text">Please check your connection and try again.</p>
          <button className="leaderboard__retry" onClick={retry}>
            Try again
          </button>
        </div>
      );
      break;
    }
    default: {
      content = null;
    }
  }
  return content;
}
