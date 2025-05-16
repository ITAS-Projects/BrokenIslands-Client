import React from "react";
import "../assets/Home.css";
import { useUser } from "@descope/react-sdk";


function Home() {
  const { user } = useUser();

  return (
    <div className="Home">
      <header className="Home-header">
        <h1>Hello {user.name}!</h1>
        <p>Welcome! Would you like to make a reservation?</p>
        <button onClick={() => window.location.href = `/wizard`}>
          Start Reservation Wizard
        </button>
      </header>
    </div>
  );
}

export default Home;
