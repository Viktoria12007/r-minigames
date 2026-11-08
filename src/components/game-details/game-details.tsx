import { imageSource } from '../../shared/image-source.ts';
import type {
  AppSession,
  CommentsMeta,
  FavoriteResponse,
  GameComment,
  GameDetails,
  LikeResponse,
  Status,
} from '../../types/types.ts';
import { formatLikes } from '../../shared/format-likes.ts';
import { relativeTime } from '../../shared/relative-time.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getApi, postApi } from '../../shared/api.ts';
import { useSnackbar } from '../../hooks/use-snackbar.ts';
import SkeletonGameDetails from './skeleton-game-details.tsx';
import useSession from '../../hooks/use-session.ts';
import type { SubmitEvent } from 'react';

interface IGameDetailsProperties {
  selectedGame: string;
}

function avatarInitial(name: string): string {
  return name.trim().charAt(0).toLocaleUpperCase() || '?';
}

function validAuthorName(session: AppSession): string {
  const candidate =
    session.displayName.trim() || session.email.split('@', 1)[0]?.trim() || 'Player';
  return candidate.length < 2 ? 'Player' : candidate.slice(0, 30);
}

export default function GameDetails({ selectedGame }: IGameDetailsProperties) {
  const { session } = useSession();
  const { showSnackbar } = useSnackbar();

  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [comments, setComments] = useState<GameComment[]>([]);
  const [statusGameDetails, setStatusGameDetails] = useState<Status>('loading');
  const [statusComments, setStatusComments] = useState<Status>('loading');
  const [statusLikeComment, setStatusLikeComment] = useState(false);
  const [statusFavorite, setStatusFavorite] = useState(false);
  const [avatarColors, setAvatarColors] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [statusComment, setStatusComment] = useState(false);

  const colorFor = useCallback(
    (authorName: string): number => {
      const stored = avatarColors[authorName];
      if (stored !== undefined) {
        return stored;
      }
      const color = Math.floor(Math.random() * 5);
      setAvatarColors((previously) => ({
        ...previously,
        [authorName]: Math.floor(Math.random() * 5),
      }));
      return color;
    },
    [avatarColors],
  );

  const controllerAddCommentReference = useRef<AbortController | null>(null);

  function handleAddComment(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session) return;

    controllerAddCommentReference.current?.abort();

    const controller = new AbortController();
    controllerAddCommentReference.current = controller;

    const text = comment.trim();

    if (!text) {
      showSnackbar('Write a comment before sending it.', 'error');
      return;
    }

    if (text.length > 500) {
      showSnackbar('A comment can contain up to 500 characters.', 'error');
      return;
    }

    if (statusComment) return;

    setStatusComment(false);

    void postApi<GameComment>(
      `/games/${encodeURIComponent(selectedGame)}/comments`,
      {
        userEmail: session.email,
        authorName: validAuthorName(session),
        text,
      },
      controller.signal,
    )
      .then(() => {
        if (controller.signal.aborted) return;

        setComment('');
        showSnackbar('Comment posted.', 'success');
        retryFetchComments();
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        showSnackbar(
          'We could not confirm your comment. Your text was kept so you can check and retry.',
          'error',
        );
      })
      .finally(() => {
        setStatusComment(false);
      });
  }

  const controllerFavoriteReference = useRef<AbortController | null>(null);

  function handleFavorite(game: GameDetails) {
    if (!session || statusFavorite) return;
    setStatusFavorite(true);

    controllerFavoriteReference.current?.abort();

    const controller = new AbortController();
    controllerFavoriteReference.current = controller;

    void postApi<FavoriteResponse>(
      `/games/${encodeURIComponent(game.slug)}/favorite`,
      { userEmail: session.email },
      controller.signal,
    )
      .then(({ data }) => {
        if (controller.signal.aborted) return;

        game.isLikedByCurrentUser = data.isFavorited;
        game.likesCount = data.likesCount;
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        showSnackbar(
          'We could not confirm your favorite. Please check the current state before trying again.',
          'error',
        );
      })
      .finally(() => {
        setStatusFavorite(false);
      });
  }

  const controllerLikeCommentReference = useRef<AbortController | null>(null);

  function handleLikeComment(comment: GameComment) {
    if (!session || statusLikeComment) return;
    setStatusLikeComment(true);

    controllerLikeCommentReference.current?.abort();

    const controller = new AbortController();
    controllerLikeCommentReference.current = controller;

    void postApi<LikeResponse>(
      `/comments/${encodeURIComponent(comment.commentId)}/like`,
      { userEmail: session?.email as string },
      controller.signal,
    )
      .then(({ data }) => {
        if (controller.signal.aborted) return;

        comment.likesCount = data.likesCount;
        comment.isLikedByCurrentUser = data.isLikedByCurrentUser;
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        showSnackbar(
          'We could not confirm your like. Please check the current state before trying again.',
          'error',
        );
      })
      .finally(() => {
        setStatusLikeComment(false);
      });
  }

  const controllerGameDetailsReference = useRef<AbortController | null>(null);
  const controllerCommentsReference = useRef<AbortController | null>(null);

  const fetchGameDetails = useCallback(() => {
    controllerGameDetailsReference.current?.abort();

    const controller = new AbortController();
    controllerGameDetailsReference.current = controller;

    void getApi<GameDetails>(
      `/games/${encodeURIComponent(selectedGame)}${session ? `?userEmail=${encodeURIComponent(session.email)}` : ''}`,
      controller.signal,
    )
      .then(({ data }) => {
        if (controller.signal.aborted) return;

        setGameDetails(data);
        setStatusGameDetails(data ? 'success' : 'empty');
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setStatusGameDetails('error');
        showSnackbar('Game details could not be loaded. Please try again.', 'error');
      });
  }, [selectedGame, session, showSnackbar]);

  const fetchComments = useCallback(() => {
    controllerCommentsReference.current?.abort();

    const controller = new AbortController();
    controllerCommentsReference.current = controller;

    void getApi<GameComment[], CommentsMeta>(
      `/games/${encodeURIComponent(selectedGame)}/comments?limit=3&sort=newest${session ? `&userEmail=${encodeURIComponent(session.email)}` : ''}`,
      controller.signal,
    )
      .then(({ data }) => {
        if (controller.signal.aborted) return;

        setComments(data);
        setStatusComments(data.length === 0 ? 'empty' : 'success');
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setStatusComments('error');
        showSnackbar('Comments could not be loaded. Please try again.', 'error');
      });
  }, [selectedGame, session, showSnackbar]);

  const retryFetchGameDetails = () => {
    setStatusGameDetails('loading');
    fetchGameDetails();
  };

  const retryFetchComments = () => {
    setStatusComments('loading');
    fetchComments();
  };

  useEffect(() => {
    fetchGameDetails();
    fetchComments();

    return () => {
      controllerAddCommentReference.current?.abort();
      controllerLikeCommentReference.current?.abort();
      controllerFavoriteReference.current?.abort();
      controllerGameDetailsReference.current?.abort();
      controllerCommentsReference.current?.abort();
    };
  }, [fetchComments, fetchGameDetails]);

  return (
    <div className="game-details__content">
      {statusGameDetails === 'success' && gameDetails ? (
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
            <div className="game-details__badges">
              {Object.entries(gameDetails.specs).map(([label, value]) => (
                <div key={label} className="game-details__badge">
                  <span className="game-details__badge-label">{label}</span>
                  <strong className="game-details__badge-value">{value}</strong>
                </div>
              ))}
            </div>
            <div className="game-details__actions">
              <button className="button game-details__play">Play Now</button>
              <button
                className={`game-details__favorite ${gameDetails.isLikedByCurrentUser === true ? 'is-favorite' : ''} ${statusFavorite ? 'is-loading' : ''}`}
                aria-label={gameDetails.isLikedByCurrentUser ? 'In Favorites' : 'Add to Favorites'}
                aria-busy={statusFavorite}
                disabled={statusFavorite}
                onClick={() => handleFavorite(gameDetails)}
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
                {gameDetails.topRecords.map((record, index) => (
                  <li key={index} className="game-details__record">
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
              <form className="game-details__form" onSubmit={(event) => handleAddComment(event)}>
                {session && (
                  <span className="game-details__avatar game-details__avatar_current">
                    {avatarInitial(validAuthorName(session))}
                  </span>
                )}
                <textarea
                  className={`game-details__textarea ${session ? '' : 'game-details__textarea_wide'}`}
                  name="comment"
                  placeholder={session ? 'Write a comment…' : 'Sign in to write a comment'}
                  maxLength={500}
                  rows={1}
                  disabled={!session || statusComment}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                ></textarea>
                <button
                  className="game-details__submit"
                  aria-label={session ? 'Send comment' : 'Sign in to comment'}
                  aria-busy={statusComment}
                  type={session ? 'submit' : 'button'}
                  disabled={statusComment}
                >
                  ➤
                </button>
              </form>
              <div className="game-details__comments-content">
                <ul className="game-details__comment-list">
                  {statusComments === 'success' ? (
                    comments.map((comment) => (
                      <li key={comment.commentId} className="game-details__comment">
                        <div className="game-details__comment-header">
                          <span
                            className={`game-details__avatar game-details__avatar_${colorFor(comment.authorName)}`}
                          >
                            {avatarInitial(comment.authorName)}
                          </span>
                          <strong className="game-details__comment-author">
                            {comment.authorName}
                          </strong>
                          <time className="game-details__comment-time">
                            {relativeTime(comment.createdAt)}
                          </time>
                        </div>
                        <p className="game-details__comment-text">{comment.text}</p>
                        <button
                          className={`game-details__like ${comment.isLikedByCurrentUser === true ? 'is-liked' : ''} ${statusLikeComment ? 'is-loading' : ''}`}
                          aria-label={`${comment.likesCount} likes`}
                          aria-busy={statusLikeComment}
                          disabled={statusLikeComment}
                          onClick={() => handleLikeComment(comment)}
                        >
                          {`${comment.isLikedByCurrentUser ? '♥' : '♡'} ${formatLikes(comment.likesCount)}`}
                        </button>
                      </li>
                    ))
                  ) : (
                    <SkeletonGameDetails
                      status={statusComments}
                      subject="comments"
                      retry={statusComments === 'error' ? retryFetchComments : undefined}
                    />
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <SkeletonGameDetails
          status={statusGameDetails}
          subject="game"
          retry={statusGameDetails === 'error' ? retryFetchGameDetails : undefined}
        />
      )}
    </div>
  );
}
