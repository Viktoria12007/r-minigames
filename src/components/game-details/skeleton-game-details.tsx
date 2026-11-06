import type { Status } from '../../types/types.ts';
import * as React from 'react';

interface ISkeletonGameDetailsProperties {
  status: Status;
  retry?: () => void;
  subject: 'game' | 'comments';
}

export default function SkeletonGameDetails({
  status,
  retry,
  subject,
}: ISkeletonGameDetailsProperties) {
  let content: React.ReactNode;
  switch (status) {
    case 'loading': {
      content = (
        <div
          className={`game-details__state game-details__state_${status}`}
          role="status"
          aria-label={`Loading ${subject}`}
        >
          {Array.from({ length: subject === 'game' ? 5 : 3 }, (_, index) => (
            <div key={index} className="game-details__skeleton"></div>
          ))}
        </div>
      );
      break;
    }
    case 'empty': {
      content = (
        <div className={`game-details__state game-details__state_${status}`} role="status">
          <p className="game-details__state-title">{`No ${subject} found`}</p>
          <p className="game-details__state-text">
            {subject === 'game'
              ? 'This game is not available right now.'
              : 'Be the first to comment on this game.'}
          </p>
        </div>
      );
      break;
    }
    case 'error': {
      content = (
        <div className={`game-details__state game-details__state_${status}`} role="alert">
          <p className="game-details__state-title">{`Could not load ${subject}`}</p>
          <p className="game-details__state-text">Please check your connection and try again.</p>
          <button className="game-details__retry" onClick={retry}>
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
