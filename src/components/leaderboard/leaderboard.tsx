import { useCallback, useEffect, useRef, useState } from 'react';
import type { Leader, Status } from '../../types/types.ts';
import { getApi } from '../../shared/api.ts';
import SkeletonLeaderboard from './skeleton-leaderboard.tsx';
import { useSnackbar } from '../../hooks/use-snackbar.ts';

const columns = ['Rank', 'Player', 'Games', 'Total', 'Streak', 'Favorite Game'];

export default function Leaderboard() {
  const { showSnackbar } = useSnackbar();
  const [status, setStatus] = useState<Status>('loading');
  const [leaders, setLeaders] = useState<Leader[]>([]);

  const controllerReference = useRef<AbortController | null>(null);

  const fetchLeaders = useCallback(() => {
    controllerReference.current?.abort();

    const controller = new AbortController();
    controllerReference.current = controller;

    void getApi<Leader[]>('/leaderboard', controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;

        setLeaders(data);
        setStatus(data.length === 0 ? 'empty' : 'success');
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setStatus('error');
        showSnackbar('Top players could not be loaded. Please try again.', 'error');
      })
      .finally(() => {
        if (controllerReference.current === controller) {
          controllerReference.current = null;
        }
      });
  }, [showSnackbar]);

  const retry = () => {
    setStatus('loading');
    fetchLeaders();
  };

  useEffect(() => {
    fetchLeaders();

    return () => controllerReference.current?.abort();
  }, [fetchLeaders]);

  return (
    <section className="leaderboard" aria-labelledby="leaderboard-title">
      <h2 className="title" id="leaderboard-title">
        <span>Top Players </span>
        <span className="leaderboard__title_hide">This Week</span>
      </h2>
      <div className="leaderboard__content">
        {status === 'success' ? (
          <div className="leaderboard__table-wrap">
            <table className="leaderboard__table">
              <thead className="leaderboard__thead">
                <tr>
                  {columns.map((text, index) => (
                    <th key={text} className={index === 5 ? 'wide' : ''}>
                      {text === 'Games' && (
                        <>
                          {text}
                          <span className={'leaderboard__col-title_hide'}> Played</span>
                        </>
                      )}
                      {text === 'Total' && (
                        <>
                          <span className={'leaderboard__col-title_hide'}>Total </span>
                          Score
                        </>
                      )}
                      {text !== 'Games' && text !== 'Total' && text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="leaderboard__tbody">
                {leaders.map((leader, index) => (
                  <tr key={index}>
                    <td>{`# ${leader.rank}`}</td>
                    <td>
                      <div className={`leaderboard__avatar leaderboard__avatar_${index + 1}`}>
                        {leader.playerName.match(/[A-Z]/g)?.slice(0, 2).join('') ??
                          leader.playerName.slice(0, 2)}
                      </div>
                      {leader.playerName}
                    </td>
                    <td>{leader.gamesPlayed}</td>
                    <td>
                      <span className="leaderboard__score_desktop">
                        {`${(leader.totalScore / 1000).toFixed(3).replace('.', ',')}`}
                      </span>
                      <span className="leaderboard__score_mobile">
                        {`${(leader.totalScore / 1000).toFixed(1)}K`}
                      </span>
                    </td>
                    <td>
                      <span className="leaderboard__streak_desktop">
                        {`🔥 ${leader.streakDays} ${leader.streakDays === 1 ? 'day' : 'days'}`}
                      </span>
                      <span className="leaderboard__streak_mobile">
                        {`🔥 ${leader.streakDays}d`}
                      </span>
                    </td>
                    <td className="wide">
                      <div className="leaderboard__favorite-game">{leader.favoriteGameName}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <SkeletonLeaderboard status={status} retry={status === 'error' ? retry : undefined} />
        )}
      </div>
    </section>
  );
}
