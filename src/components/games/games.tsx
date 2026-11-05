import { useSnackbar } from '../../hooks/use-snackbar.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import type { FeaturedGame, Status } from '../../types/types.ts';
import { getApi } from '../../shared/api.ts';
import { baseUrl } from '../../shared/base-url.ts';
import SkeletonGames from './skeleton-games.tsx';

const autoplayDelay = 4000;

function imageSource(path: string): string {
  return /^(?:https?:)?\/\//.test(path) ? path : `${baseUrl}/${path.replace(/^\//, '')}`;
}

function formatLikes(likes: number): string {
  return `${(likes / 1000).toFixed(1)}K`;
}

function visibleDistance(): number {
  return matchMedia('(max-width: 1024px)').matches ? 1 : 2;
}

export default function Games() {
  const { showSnackbar } = useSnackbar();
  const [status, setStatus] = useState<Status>('loading');
  const [games, setGames] = useState<FeaturedGame[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [pointerStart, setPointerStart] = useState<{ x: number; y: number } | undefined>(undefined);

    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const controllerReference = useRef<AbortController | null>(null);

  const visible = visibleDistance();

  const clearTimer = useCallback(() => {
    if (timer.current === undefined) return;
    clearTimeout(timer.current);
    timer.current = undefined;
  }, []);

  const move = useCallback(
    (direction: number) => {
      setActiveIndex((index) => (index + direction + games.length) % games.length);
    },
    [games.length],
  );

  const startTimer = useCallback(() => {
    if (games.length < 2) return;
    clearTimer();
    timer.current = setTimeout(() => move(1), autoplayDelay);
  }, [clearTimer, games.length, move]);

  const fetchGames = useCallback(() => {
      controllerReference.current?.abort();

      const controller = new AbortController();
      controllerReference.current = controller;

    void getApi<FeaturedGame[]>('/games?featured=true', controller.signal)
      .then(({ data }) => {
          if (controller.signal.aborted) return;

        setGames(data);
        setStatus(data.length === 0 ? 'empty' : 'success');
      })
      .catch(() => {
          if (controller.signal.aborted) return;

        setStatus('error');
        showSnackbar('Featured games could not be loaded. Please try again.', 'error');
      })
        .finally(() => {
            if (controllerReference.current === controller) {
                controllerReference.current = null;
            }
        })
  }, [showSnackbar]);

  const retry = () => {
    setStatus('loading');
    fetchGames();
  };

  useEffect(() => {
    fetchGames();

    return () => controllerReference.current?.abort();
  }, [fetchGames]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [activeIndex, clearTimer, startTimer]);

  const circularOffset = (index: number) => {
    const difference = index - activeIndex;
    const half = Math.floor(games.length / 2);
    if (difference > half) return difference - games.length;
    return difference < -half ? difference + games.length : difference;
  };

  const pointerDown = (event: PointerEvent) => {
    setPointerStart({ x: event.clientX, y: event.clientY });
    clearTimer();
  };

  const pointerUp = (event: PointerEvent) => {
    if (!pointerStart) return;
    const horizontal = event.clientX - pointerStart.x;
    const vertical = event.clientY - pointerStart.y;
    setPointerStart(undefined);
    if (
      Math.abs(horizontal) > 40 &&
      Math.abs(horizontal) > Math.abs(vertical) &&
      games.length > 1
    ) {
      move(horizontal < 0 ? 1 : -1);
    } else {
      startTimer();
    }
  };

  const pointerCancel = () => {
    setPointerStart(undefined);
    startTimer();
  };

  return (
    <section className="games" aria-labelledby="games-title">
      <div className="games__heading">
        <h2 className="title" id="games-title">
          New Games
        </h2>
        <div className="games__slider-controls" hidden={status !== 'success'}>
          <button
            className="games__button games__button_prev"
            aria-label="Previous games"
            disabled={games.length < 2}
            onClick={() => move(-1)}
          ></button>
          <button
            className="games__button games__button_next"
            aria-label="Next games"
            disabled={games.length < 2}
            onClick={() => move(1)}
          ></button>
        </div>
      </div>
      <div className="games__content">
        {status === 'success' ? (
          <div
            className="games__track"
            aria-roledescription="carousel"
            onPointerDown={(event) => pointerDown(event)}
            onPointerUp={(event) => pointerUp(event)}
            onPointerCancel={pointerCancel}
          >
            {games.map((game, index) => {
              const offset = circularOffset(index);
              const distance = Math.abs(offset);
              return (
                <article
                  key={game.name}
                  className="games__card"
                  tabIndex={distance <= visible ? 0 : -1}
                  aria-label={`Open details for ${game.name}`}
                  style={{ order: String(offset) }}
                  data-size={distance === 0 ? 'large' : distance === 1 ? 'medium' : 'small'}
                  data-visible={String(distance <= visible)}
                  aria-hidden={distance > visible}
                >
                  <img className="games__image" src={imageSource(game.cardImage)} alt={game.name} />
                  <div className="games__card-info">
                    <div className="games__name">{game.name}</div>
                    <div className="games__rating">{game.rating}</div>
                    <div className="games__likes">{formatLikes(game.likesCount)}</div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <SkeletonGames status={status} retry={status === 'error' ? retry : undefined} />
        )}
      </div>
    </section>
  );
}
