import Intro from '../components/intro/intro.tsx';
import Cards from '../components/cards/cards.tsx';

export default function Library() {
  return (
    <section className="library-page">
      <Intro />
      <Cards />
    </section>
  );
}
