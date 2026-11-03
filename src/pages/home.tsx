import Hero from '../components/hero/hero.tsx';
import Leaderboard from '../components/leaderboard/leaderboard.tsx';
import Developer from '../components/developer/developer.tsx';
import Games from '../components/games/games.tsx';

export default function Home() {
  return (
    <>
      <Hero />
      <Games />
      <Leaderboard />
      <Developer />
    </>
  );
}
