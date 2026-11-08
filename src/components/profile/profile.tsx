import profileName from '../../shared/profile-name.ts';
import { initials } from '../../shared/initials.ts';
import { useState } from 'react';
import type { AppSession } from '../../types/types.ts';

interface ProfileProperties {
  session: AppSession;
}

export default function Profile({ session }: ProfileProperties) {
  const [name, _] = useState(profileName(session.displayName, session.email));

  return (
    <div className="header__profile">
      <span className="header__profile-name">{name}</span>
      <span className="header__profile-avatar" aria-label={`${session.displayName}'s avatar`}>
        {session.avatarUrl ? (
          <img
            className="header__profile-avatar-image"
            src={session.avatarUrl}
            alt={session.displayName}
          />
        ) : (
          (initials(name) ?? <span className="$header__profile-avatar-generic">•</span>)
        )}
      </span>
    </div>
  );
}
