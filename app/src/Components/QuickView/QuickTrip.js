import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/QuickTrip.css";

function QuickTrip() {
    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch all trips
    useEffect(() => {
        axios.get("http://localhost:8081/trips")
            .then((response) => {
                setTrips(response.data);
                setSelectedTripId(response.data[0]?.id || null);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching trips:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading trips...</div>;
    if (!trips.length) return <div>No trips found.</div>;

    const selectedTrip = trips.find(trip => trip.id === selectedTripId);

    // Helper function to format the date
    const formatDate = (iso) => new Date(iso).toISOString().split("T")[0];

    // Calculate the number of people used on the trip
    const peopleUsed = selectedTrip.Reservations?.reduce((sum, res) => {
        return sum + (res.Group?.numberOfPeople || 0);
    }, 0) ?? 0;

    // Calculate the number of boats used on the trip
    const boatsUsed = selectedTrip.Reservations?.reduce((resTotal, res) => {
        return resTotal + (res.Boats?.reduce((bSum, boat) => bSum + (boat.numberOf || 0), 0) || 0);
    }, 0) ?? 0;

    // Taxi capacity
    const peopleCapacity = selectedTrip.Taxi?.spaceForPeople || 0;
    const boatsCapacity = selectedTrip.Taxi?.spaceForKayaks || 0;

    return (
        <div className="trip-container">
            {/* Left Panel: List of trips */}
            <div className="trip-list">
                {trips.map((trip) => (
                    <div
                        key={trip.id}
                        className={`trip-item ${trip.id === selectedTripId ? "active" : ""}`}
                        onClick={() => setSelectedTripId(trip.id)}
                    >
                        {formatDate(trip.day)} – {trip.timeFrame}
                    </div>
                ))}
            </div>

            {/* Right Panel: Selected Trip Details */}
            <div className="trip-details">
                {selectedTrip && (
                    <>
                        <h2>{selectedTrip.timeFrame}</h2>
                        <p><strong>Date:</strong> {formatDate(selectedTrip.day)}</p>
                        <p><strong>Taxi ID:</strong> #{selectedTrip.Taxi?.id}</p>
                        <p><strong>Taxi Capacity:</strong> {peopleCapacity} people / {boatsCapacity} boats</p>
                        <p><strong>Used Capacity:</strong> {peopleUsed} people / {boatsUsed} boats</p>

                        <h3>Reservations:</h3>
                        <ol>
                            {selectedTrip.Reservations.map((res) => (
                                <li key={res.id}>
                                    Reserved by: {res.Group?.leader?.name}
                                    {res.Boats?.length > 0 && (
                                        <>
                                        <span>Boats:</span>
                                        <ul>
                                            {res.Boats.map((boat, i) => (
                                                <li key={i}>
                                                    {boat.numberOf} × {boat.isRented ? "rented" : "personal"} {boat.type}
                                                </li>
                                            ))}
                                        </ul>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </>
                )}
            </div>
        </div>
    );
}

export default QuickTrip;
