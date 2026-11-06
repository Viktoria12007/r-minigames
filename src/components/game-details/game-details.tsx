import { imageSource } from '../../shared/image-source.ts';
import type { GameDetails, Status } from '../../types/types.ts';
import { formatLikes } from '../../shared/format-likes.ts';
import { relativeTime } from '../../shared/relative-time.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getApi } from '../../shared/api.ts';
import { useSnackbar } from '../../hooks/use-snackbar.ts';
import SkeletonGameDetails from './skeleton-game-details.tsx';

interface IGameDetailsProperties {
  selectedGame: string;
}

// function avatarInitial(name: string): string {
//     return name.trim().charAt(0).toLocaleUpperCase() || '?';
// }
//
// function validAuthorName(session: AppSession): string {
//     const candidate =
//         session.displayName.trim() || session.email.split('@', 1)[0]?.trim() || 'Player';
//     return candidate.length < 2 ? 'Player' : candidate.slice(0, 30);
// }

export default function GameDetails({ selectedGame }: IGameDetailsProperties) {
  const { showSnackbar } = useSnackbar();

  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  const controllerReference = useRef<AbortController | null>(null);

  const fetchGameDetails = useCallback(() => {
    controllerReference.current?.abort();

    const controller = new AbortController();
    controllerReference.current = controller;

    void getApi<GameDetails>(
      `/games/${encodeURIComponent(selectedGame as string)}`,
      controller.signal,
    )
      .then(({ data }) => {
        if (controller.signal.aborted) return;

        setGameDetails(data);
        setStatus(data ? 'success' : 'empty');
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setStatus('error');
        showSnackbar('Game details could not be loaded. Please try again.', 'error');
      });
  }, [selectedGame, showSnackbar]);

  const retry = () => {
    setStatus('loading');
    fetchGameDetails();
  };

  useEffect(() => {
    fetchGameDetails();

    return () => controllerReference.current?.abort();
  }, [fetchGameDetails]);

  return (
    <div className="game-details__content">
      {status === 'success' && gameDetails ? (
        <>
          <div className="game-details__hero">
            <img
              src={imageSource(gameDetails.heroImage)}
              alt={`${gameDetails.name} game cover`}
              className="game-details__hero-image"
            />
          </div>
          <div className="game-details__wrap">
            <h2 className="game-details__title">{gameDetails.name}</h2>
            <div className="game-details__stats">
              <span className="game-details__rating">{`☆ ${gameDetails.rating}`}</span>
              <span className="game-details__likes">
                {`♡ ${formatLikes(gameDetails.likesCount)}`}
              </span>
            </div>
            <p className="game-details__description">{gameDetails.fullDescription}</p>
            <div className="game-details__badges"></div>
            <div className="game-details__actions">
              <button className="button game-details__play">Play Now</button>
              <button
                className={`game-details__favorite ${gameDetails.isLikedByCurrentUser === true ? 'is-favorite' : ''}`}
                aria-label={gameDetails.isLikedByCurrentUser ? 'In Favorites' : 'Add to Favorites'}
              >
                <span className="game-details__favorite-icon">
                  {gameDetails.isLikedByCurrentUser ? '♥' : '♡'}
                </span>
                <span className="game-details__favorite-label">
                  {gameDetails.isLikedByCurrentUser ? 'In Favorites' : 'Add to Favorites'}
                </span>
              </button>
            </div>
            <div className="game-details__records">
              <h3 className="game-details__section-title">🏆 Top Records</h3>
              <ul className="game-details__record-list">
                {gameDetails.topRecords.map((record) => (
                  <li className="game-details__record">
                    <span className="game-details__record-medal">
                      {['🥇', '🥈', '🥉'][record.position - 1] ?? `#${record.position}`}
                    </span>
                    <strong className="game-details__record-player">{record.playerName}</strong>
                    <strong className="game-details__record-score">
                      {`${record.score.toLocaleString('en-US')} pts`}
                    </strong>
                    <time className="game-details__record-time">
                      {relativeTime(record.achievedAt)}
                    </time>
                  </li>
                ))}
              </ul>
            </div>
            <div className="game-details__comments">
              <h3 className="game-details__section-title">Comments</h3>
              <form className="game-details__form">
                <span className="game-details__avatar game-details__avatar_current">
                  {/*{avatarInitial(validAuthorName(formSession))}*/}
                </span>
                <textarea
                  className="game-details__textarea"
                  name="comment"
                  placeholder="Write a comment…"
                  maxLength={500}
                  rows={1}
                ></textarea>
                <button className="game-details__submit">➤</button>
              </form>
              <div className="game-details__comments-content">
                <ul className="game-details__comment-list">
                  {/*{*/}
                  {/*    comments.map((comment) => (*/}
                  {/*        <li key={comment.id} className='game-details__comment'>*/}
                  {/*            <div className='game-details__comment-header'>*/}
                  {/*    <span className={`game-details__avatar game-details__avatar_${colorFor(comment.authorName)}`}>*/}
                  {/*        {avatarInitial(comment.authorName)}*/}
                  {/*    </span>*/}
                  {/*                <strong className='game-details__comment-author'>*/}
                  {/*                    {comment.authorName}*/}
                  {/*                </strong>*/}
                  {/*                <time className='game-details__comment-time'>*/}
                  {/*                    {relativeTime(comment.createdAt)}*/}
                  {/*                </time>*/}
                  {/*            </div>*/}
                  {/*            <p className='game-details__comment-text'>{comment.text}</p>*/}
                  {/*            <button*/}
                  {/*                className={`game-details__like ${comment.isLikedByCurrentUser === true ? 'is-liked' : ''}`}*/}
                  {/*                aria-label={`${comment.likesCount} likes`}*/}
                  {/*            >*/}
                  {/*                {`♡ ${formatLikes(comment.likesCount)}`}*/}
                  {/*            </button>*/}
                  {/*        </li>*/}
                  {/*    ))*/}
                  {/*}*/}
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <SkeletonGameDetails
          status={status}
          subject={'game'}
          retry={status === 'error' ? retry : undefined}
        />
      )}
    </div>
  );
}
