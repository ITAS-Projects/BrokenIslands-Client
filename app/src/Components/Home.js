import React from "react";
import "../assets/Home.css";
import { useUser } from "@descope/react-sdk";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="Home">
      <header className="Home-header">
        <h1>Hello{user?.name && ` ${user.name}`}!</h1>
        <p>Welcome! Would you like to make a reservation?</p>
        <button onClick={() => navigate(`/quick/reservation/new`)}>
          New Reservation
        </button>
      </header>
    </div>
  );
}

export default Home;
