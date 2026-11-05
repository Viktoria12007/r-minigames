import SkeletonCards from './skeleton-cards.tsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { GamesMeta, LibraryGame, Status } from '../../types/types.ts';
import { useSnackbar } from '../../hooks/use-snackbar.ts';
import { formatLikes } from '../../shared/format-likes.ts';
import { imageSource } from '../../shared/image-source.ts';
import { getApi } from '../../shared/api.ts';
import { useLocation } from 'react-router';
import Pagination from '../pagination/pagination.tsx';

const pageSize = 6;

export default function Cards() {
  const { search } = useLocation();
  const { showSnackbar } = useSnackbar();
  const [status, setStatus] = useState<Status>('loading');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [games, setGames] = useState<LibraryGame[]>([]);

  const controllerReference = useRef<AbortController | null>(null);

  const fetchGames = useCallback(() => {
    controllerReference.current?.abort();

    const controller = new AbortController();
    controllerReference.current = controller;

    const parameters = new URLSearchParams(`${search}&limit=${pageSize}`);
    void getApi<LibraryGame[], GamesMeta>(`/games?${parameters}`, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;

        setTotalPages(Math.max(1, response.meta?.totalPages ?? 1));
        setGames(response.data);
        setStatus(response.data.length === 0 ? 'empty' : 'success');
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setStatus('error');
        showSnackbar('Games could not be loaded. Please try again.', 'error');
      })
      .finally(() => {
        if (controllerReference.current === controller) {
          controllerReference.current = null;
        }
      });
  }, [showSnackbar, search]);

  const retry = () => {
    setStatus('loading');
    fetchGames();
  };

  useEffect(() => {
    fetchGames();

    return () => {
      controllerReference.current?.abort();
      setStatus('loading');
    };
  }, [fetchGames]);

  return (
    <>
      <div className="library-list">
        {status === 'success' ? (
          games.map((game) => (
            <article key={game.name} className="library-card">
              <img
                src={imageSource(game.cardImage)}
                alt={game.name}
                className="library-card__image"
              />
              <div className="library-card__content">
                <div className="library-card__heading">
                  <h2 className="library-card__name">{game.name}</h2>
                  <span className="library-card__category">{game.category}</span>
                  <strong
                    className={
                      game.price === 'Free'
                        ? 'library-card__price library-card__price_free'
                        : 'library-card__price'
                    }
                  >
                    {game.price}
                  </strong>
                </div>
                <p className="library-card__description">{game.shortDescription}</p>
                <div className="library-card__meta">
                  <span className="library-card__rating">{game.rating}</span>
                  <span className="library-card__likes">{formatLikes(game.likesCount)}</span>
                </div>
                <button className="library-card__details button">Details</button>
              </div>
            </article>
          ))
        ) : (
          <SkeletonCards status={status} retry={status === 'error' ? retry : undefined} />
        )}
      </div>
      <Pagination totalPages={totalPages} />
    </>
  );
}
