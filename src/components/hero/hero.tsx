import { Link } from 'react-router';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__art" aria-hidden="true"></div>
      <div className="hero__card">
        <h1 className="hero__title" id="hero-title">
          Take a Short Break & Have Fun
        </h1>
        <p className="hero__text">
          Discover hundreds of curated casual mini-games. Play instantly in your browser — puzzle,
          match 3, farm, and board classics.
        </p>
        <Link className="hero__button button" to="library">
          Browse Library
        </Link>
      </div>
    </section>
  );
}
