import profileName from '../../shared/profile-name.ts';
import initialAvatar from '../../shared/initial-avatar.ts';
import { useState } from 'react';
import type { AppSession } from '../../types/types.ts';

interface ProfileProperties {
  session: AppSession;
}

export default function Profile({ session }: ProfileProperties) {
  const [isAvatarExist, setIsAvatarExists] = useState(Boolean(session.avatarUrl));
  const name = profileName(session.displayName, session.email);
  return (
    <div className="header__profile">
      {isAvatarExist ? (
        <img
          className="header__profile-avatar-image"
          src={session.avatarUrl}
          alt={session.displayName}
          onError={() => setIsAvatarExists(false)}
        />
      ) : (
        <span className="header__profile-avatar" aria-label={`${session.displayName}'s avatar`}>
          {initialAvatar(name) ?? '•'}
        </span>
      )}
    </div>
  );
}
