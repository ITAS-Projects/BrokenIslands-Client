import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/QuickReservation.css";

function QuickReservation() {
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8081/reservations")
            .then((response) => {
                setReservations(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching reservations:", error);
                setError("Failed to load reservations.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading reservations...</div>;
    if (error) return <div>{error}</div>;
    if (reservations.length === 0) return <p>No reservations found.</p>;

    const selectedReservation = reservations[selectedIndex];

    return (
        <div className="reservation-container">
            {/* Left Panel: List */}
            <div className="reservation-list">
                {reservations.map((res, idx) => (
                    <div
                        key={idx}
                        className={`reservation-item ${idx === selectedIndex ? "active" : ""}`}
                        onClick={() => setSelectedIndex(idx)}
                    >
                        #{idx + 1} - {res.Group?.leader?.name || "No Leader"}
                    </div>
                ))}
            </div>

            {/* Right Panel: Details */}
            <div className="reservation-details">
                <h2>Reservation #{selectedIndex + 1}</h2>
                <p><strong>Leader:</strong> {selectedReservation.Group?.leader?.name}</p>
                <p><strong>People:</strong> {selectedReservation.Group?.numberOfPeople}</p>
                <h4>Trip:</h4>
                <ul>
                    {selectedReservation.Trips?.map((trip, i) => (
                        <li key={i}>
                            {trip.timeFrame}, {trip.day.split("T")[0]}
                        </li>
                    ))}
                </ul>
                {selectedReservation.Boats?.length > 0 && (<>
                <h4>Boats:</h4>
                <ul>
                    {selectedReservation.Boats?.map((boat, i) => (
                        <li key={i}>
                            {boat.numberOf} {boat.isRented ? "rented" : "personal"} {boat.type}
                        </li>
                    ))}
                </ul>
                </>)}
            </div>
        </div>
    );
}

export default QuickReservation;
