import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/Quick.css';

const Quick = () => {
  return (
    <div>
      <h1>Quick Access</h1>
      <div className="quick-links">
        <Link to="/quick/taxi" className="quick-link">Taxi</Link>
        <Link to="/quick/reservation" className="quick-link">Reservation</Link>
        <Link to="/quick/trip" className="quick-link">Trip</Link>
      </div>
    </div>
  );
};

export default Quick;
