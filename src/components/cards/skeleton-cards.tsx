import * as React from 'react';
import type { Status } from '../../types/types.ts';

interface ISkeletonCardsProperties {
  status: Status;
  retry?: () => void;
}

export default function SkeletonCards({ status, retry }: ISkeletonCardsProperties) {
  let content: React.ReactNode;
  switch (status) {
    case 'loading': {
      content = (
        <div
          className={`library-list__state library-list__state_${status}`}
          role="status"
          aria-label="Loading games"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="library-list__skeleton"></div>
          ))}
        </div>
      );
      break;
    }
    case 'empty': {
      content = (
        <div className={`library-list__state library-list__state_${status}`} role="status">
          <p className="library-list__state-title">Data Not Found</p>
          <p className='library-list__state-text'>Try another category or sort option.</p>
        </div>
      );
      break;
    }
    case 'error': {
      content = (
        <div className={`library-list__state library-list__state_${status}`} role="alert">
          <p className="library-list__state-title">Could not load games</p>
          <p className="library-list__state-text">Please check your connection and try again.</p>
          <button className="library-list__retry button" onClick={retry}>
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
