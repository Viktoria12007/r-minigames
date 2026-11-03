import * as React from 'react';
import type { Status } from '../../types/types.ts';

interface ISkeletonGamesProperties {
  status: Status;
  retry?: () => void;
}

export default function SkeletonGames({ status, retry }: ISkeletonGamesProperties) {
  let content: React.ReactNode;
  switch (status) {
    case 'loading': {
      content = (
        <div
          className={`games__state games__state_${status}`}
          role="status"
          aria-label="Loading featured games"
        >
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="games__skeleton"></div>
          ))}
        </div>
      );
      break;
    }
    case 'empty': {
      content = (
        <div className={`games__state games__state_${status}`} role="status">
          <p className="games__state-title">No featured games yet</p>
          <p className="games__state-text">Check back soon for new games.</p>
        </div>
      );
      break;
    }
    case 'error': {
      content = (
        <div className={`games__state games__state_${status}`} role="alert">
          <p className="games__state-title">Could not load featured games</p>
          <p className="games__state-text">Please check your connection and try again.</p>
          <button className="games__retry" onClick={retry}>
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
