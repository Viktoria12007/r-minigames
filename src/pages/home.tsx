import Hero from '../components/hero/hero.tsx';
import Leaderboard from '../components/leaderboard/leaderboard.tsx';
import Developer from '../components/developer/developer.tsx';

export default function Home() {
  return (
    <>
      <Hero />
      <Leaderboard />
      <Developer />
    </>
  );
}
