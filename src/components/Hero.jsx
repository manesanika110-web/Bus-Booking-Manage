import "./../css/Hero.css";
import SearchBox from "./SearchBox";

function Hero() {
  return (
    <section className="hero">
      <div className="overlay">
        <h1>Book Bus Tickets Online</h1>

        <p>Fast, Safe & Comfortable Bus Journey Across India</p>

        <SearchBox />
      </div>
    </section>
  );
}

export default Hero;
