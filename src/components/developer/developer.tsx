export default function Developer() {
  return (
    <section className="developer" aria-labelledby="developer-title">
      <div className="developer__image"></div>
      <div className="developer__card">
        <h2 className="title developer__title" id="developer-title">
          Are You a Game Developer?
        </h2>
        <p className="developer__text">
          Want to see your game on MiniGames? We're always looking for fun, engaging mini games to
          add to our platform. Submit your game and reach thousands of players!
        </p>
        <button className="button developer__button">Submit Form</button>
        <small className="developer__contact">or contact us at developers@minigames.com</small>
      </div>
    </section>
  );
}
