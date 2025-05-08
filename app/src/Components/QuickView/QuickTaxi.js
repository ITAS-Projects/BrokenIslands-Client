import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../../assets/QuickTaxi.css";

function QuickTaxi() {
    const [taxis, setTaxis] = useState([]);
    const [selectedTaxiID, setSelectedTaxiID] = useState(null);
    const [trips, setTrips] = useState([]);
    const [taxi, setTaxi] = useState();
    const [loading, setLoading] = useState(true);
    const [tripsLoading, setTripsLoading] = useState(false);

    // Fetch all taxis on component mount
    useEffect(() => {
        axios.get("http://localhost:8081/taxis")
            .then((response) => {
                setTaxis(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching taxis:', error);
                setLoading(false);
            });
    }, []);

    // Fetch trips for the selected taxi
    useEffect(() => {
        if (selectedTaxiID) {
            setTripsLoading(true);
            axios.get(`http://localhost:8081/taxis/${selectedTaxiID}`)
                .then((response) => {
                    setTrips(response.data.Trips);
                    setTaxi(response.data);
                    setTripsLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching trips:', error);
                    setTripsLoading(false);
                });
        }
    }, [selectedTaxiID]);

    if (loading) {
        return <div>Loading taxis...</div>;
    }

    return (
        <div>
            <h1>Quick Taxi View</h1>

            <label>Select a Taxi: </label>
            <select onChange={e => setSelectedTaxiID(e.target.value)} defaultValue="">
                <option value="" disabled>Select taxi</option>
                {taxis.map((taxi) => (
                    <option key={taxi.id} value={taxi.id}>
                        {taxi.name || `Taxi #${taxi.id}, Max Space: ${taxi.spaceForPeople} people and ${taxi.spaceForKayaks} boats`}
                    </option>
                ))}
            </select>

            {tripsLoading ? (
                <p>Loading trips...</p>
            ) : (
                trips.length > 0 && (
                    <div>
                        <h2>Trips for Taxi {selectedTaxiID}</h2>
                        <table className="trips-table">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Time Frame</th>
                                    <th>Custom Time</th>
                                    <th>Space For People Used</th>
                                    <th>Space For Boats Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trips.map((trip) => {
                                    const date = trip.day?.split('T')[0] || 'N/A';
                                    const isCustom = trip.timeFrame.startsWith("Custom");

                                    const formatTime = (timeStr) => {
                                        const [hourStr, minute] = timeStr.split(":");
                                        const hour = Number(hourStr);
                                        const formattedHour = ((hour + 11) % 12) + 1;
                                        const period = hour < 12 ? "AM" : "PM";
                                        return `${formattedHour}:${minute} ${period}`;
                                    };

                                    const peopleUsed =
                                        trip.Reservations?.reduce(
                                            (total, res) => total + (res.Group?.numberOfPeople || 0),
                                            0
                                        ) ??
                                        trip.Groups?.reduce(
                                            (total, group) => total + (group.numberOfPeople || 0),
                                            0
                                        ) ??
                                        0;

                                    const boatsUsed = trip.Reservations?.reduce((resTotal, res) => {
                                        return (
                                            resTotal +
                                            (res.Boats?.reduce(
                                                (boatTotal, boat) => boatTotal + (boat.numberOf || 0),
                                                0
                                            ) || 0)
                                        );
                                    }, 0) ?? 0;

                                    return (
                                        <tr 
                                        key={trip.id}
                                        className={
                                            peopleUsed > taxi.spaceForPeople || boatsUsed > taxi.spaceForKayaks
                                                ? "over-capacity"
                                                : ""
                                        }
                                        >
                                            <td>{date}</td>
                                            <td>{trip.timeFrame}</td>
                                            <td>{isCustom && trip.timeStart ? formatTime(trip.timeStart) : '-'}</td>
                                            <td>{peopleUsed}/{taxi.spaceForPeople}</td>
                                            <td>{boatsUsed}/{taxi.spaceForKayaks}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            )}



        </div>
    );
}

export default QuickTaxi;
