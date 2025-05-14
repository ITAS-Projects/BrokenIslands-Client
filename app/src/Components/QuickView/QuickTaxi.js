import React, { useEffect, useState } from "react";
import axiosAuth from "../../modules/authRequest";
import "../../assets/QuickTaxi.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function QuickTaxi() {
    const [taxis, setTaxis] = useState([]);
    const [selectedTaxiIndex, setSelectedTaxiIndex] = useState(0);
    const [taxi, setTaxi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tripsSorted, setTripsSorted] = useState([]);

    useEffect(() => {
        axiosAuth.get(`${backendURL}/taxis`)
            .then((response) => {
                setTaxis(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching taxis:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const timeOrder = [
            "Custom AM", "Lodge to Secret AM", "Secret to Lodge AM", "Custom", "Lodge to Secret PM", "Secret to Lodge PM", "Custom PM"
        ]

        setTaxi(taxis[selectedTaxiIndex]);
        setTripsSorted(taxi?.Trips?.sort((a, b) => {
            let dayData = a.day?.split('T')[0].split('-');
            let dayData2 = b.day?.split('T')[0].split('-');
        
            if (!dayData || !dayData2) return 0;
        
            // Compare year
            if (dayData[0] !== dayData2[0]) {
                return Number(dayData[0]) - Number(dayData2[0]);
            }
        
            // Compare month
            if (dayData[1] !== dayData2[1]) {
                return Number(dayData[1]) - Number(dayData2[1]);
            }
        
            // Compare day
            if (dayData[2] !== dayData2[2]) {
                return Number(dayData[2]) - Number(dayData2[2]);
            }
            
            
            return timeOrder.findIndex(item => item === a.timeFrame) - timeOrder.findIndex(item => item === b.timeFrame);
        }) || []);        
    }, [taxi, taxis, selectedTaxiIndex])

    if (loading) return <div>Loading taxis...</div>;

    return (
        <div className="taxi-container">
            {/* Taxi List */}
            <div className="taxi-list">
                {taxis.map((t, idx) => (
                    <div
                        key={t.id}
                        className={`taxi-item ${idx === selectedTaxiIndex ? "active" : ""}`}
                        onClick={() => setSelectedTaxiIndex(idx)}
                    >
                        {t.name || `Taxi #${t.id}`}  
                        <br />
                        <small>People: {t.spaceForPeople}, Boats: {t.spaceForKayaks}</small>
                    </div>
                ))}
            </div>

            {/* Taxi Detail Panel */}
            <div className="taxi-details">
                {taxi ? (
                    <>
                        <h2>{taxi.name || `Taxi #${taxi.id}`}</h2>
                        <p>Capacity: {taxi.spaceForPeople} people & {taxi.spaceForKayaks} boats</p>

                        <table className="trips-table">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Time Frame</th>
                                    <th>Custom Time</th>
                                    <th>People Used</th>
                                    <th>Boats Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                return (tripsSorted.map((trip) => {
                                    const date = trip.day?.split('T')[0] || 'N/A';
                                    const isCustom = trip.timeFrame.startsWith("Custom");

                                    const formatTime = (timeStr) => {
                                        const [hourStr, minute] = timeStr.split(":");
                                        const hour = Number(hourStr);
                                        const formattedHour = ((hour + 11) % 12) + 1;
                                        const period = hour < 12 ? "AM" : "PM";
                                        return `${formattedHour}:${minute} ${period}`;
                                    };

                                    const peopleUsed = trip.Reservations?.reduce(
                                        (total, res) => total + (res.Group?.numberOfPeople || 0),
                                        0
                                    ) ?? 0;

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
                                }))})()}
                            </tbody>
                        </table>
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default QuickTaxi;
