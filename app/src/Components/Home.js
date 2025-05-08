import React from "react";
import "../assets/Home.css";

function Home() {
  return (
    <div className="Home">
      <header className="Home-header">
        <h1>Hello!</h1>
        <p>Welcome! Would you like to make a reservation?</p>
        <button onClick={() => window.location.href = `/wizard`}>
          Start Reservation Wizard
        </button>
      </header>
    </div>
  );
}

export default Home;
