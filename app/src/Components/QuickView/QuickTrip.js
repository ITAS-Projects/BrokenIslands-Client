import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/QuickTrip.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function QuickTrip() {
    const [trips, setTrips] = useState([]);
    const [selectedTripIndex, setSelectedTripIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedDay, setSelectedDay] = useState("all");

    useEffect(() => {
        axios.get(`${backendURL}/trips`)
            .then((response) => {
                setTrips(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching trips:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading trips...</div>;
    if (!trips.length) return <div>No trips found.</div>;

    const formatDate = (iso) => new Date(iso).toISOString().split("T")[0];
    const getYear = (dateStr) => new Date(dateStr).getFullYear();
    const getMonth = (dateStr) => Number(dateStr.split('T')[0].split('-')[1]);
    const getDay = (dateStr) => Number(dateStr.split('T')[0].split('-')[2]);
    const getMonthName = (monthNum) =>
        new Date(2024, monthNum - 1).toLocaleString("default", { month: "long" });

    const allYears = [...new Set(trips.map(trip => getYear(trip.day)))].sort((a, b) => a - b);
    const allMonths = [...new Set(trips.map(trip => getMonth(trip.day)))].sort((a, b) => a - b);
    const allDays = [...new Set(trips.map(trip => getDay(trip.day)))].sort((a, b) => a - b);

    const monthsWithSelectedDayAndYear = selectedDay === "all" ? allMonths : [
        ...new Set(trips
            .filter(trip => {
                const matchDay = getDay(trip.day) === parseInt(selectedDay);
                const matchYear = selectedYear === "all" || getYear(trip.day) === parseInt(selectedYear);
                return matchDay && matchYear;
            })
            .map(trip => getMonth(trip.day)))
    ].sort((a, b) => a - b);

    const daysInSelectedMonthAndYear = selectedMonth === "all" ? allDays : [
        ...new Set(trips
            .filter(trip => {
                const matchMonth = getMonth(trip.day) === parseInt(selectedMonth);
                const matchYear = selectedYear === "all" || getYear(trip.day) === parseInt(selectedYear);
                return matchMonth && matchYear;
            })
            .map(trip => getDay(trip.day)))
    ].sort((a, b) => a - b);

    const yearsWithMonthAndDay = selectedMonth === "all" && selectedDay === "all"
        ? allYears
        : [
            ...new Set(trips
                .filter(trip => {
                    const matchMonth = selectedMonth === "all" || getMonth(trip.day) === parseInt(selectedMonth);
                    const matchDay = selectedDay === "all" || getDay(trip.day) === parseInt(selectedDay);
                    return matchMonth && matchDay;
                })
                .map(trip => getYear(trip.day)))
        ].sort((a, b) => a - b);

    const filteredTrips = trips.filter(trip => {
        const tripYear = getYear(trip.day);
        const tripMonth = getMonth(trip.day);
        const tripDay = getDay(trip.day);

        return (
            (selectedYear === "all" || tripYear === parseInt(selectedYear)) &&
            (selectedMonth === "all" || tripMonth === parseInt(selectedMonth)) &&
            (selectedDay === "all" || tripDay === parseInt(selectedDay))
        );
    });

    const timeOrder = [
        "Custom AM", "Lodge to Secret AM", "Secret to Lodge AM", "Custom", "Lodge to Secret PM", "Secret to Lodge PM", "Custom PM"
    ]

    filteredTrips.sort((a, b) => {
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
    })

    const selectedTrip = filteredTrips[selectedTripIndex];

    if (!selectedTrip && selectedTripIndex !== 0) {
        setSelectedTripIndex(0);
    }

    const peopleUsed = selectedTrip?.Reservations?.reduce((sum, res) => {
        return sum + (res.Group?.numberOfPeople || 0);
    }, 0) ?? 0;

    const boatsUsed = selectedTrip?.Reservations?.reduce((resTotal, res) => {
        return resTotal + (res.Boats?.reduce((bSum, boat) => bSum + (boat.numberOf || 0), 0) || 0);
    }, 0) ?? 0;

    const peopleCapacity = selectedTrip?.Taxi?.spaceForPeople || 0;
    const boatsCapacity = selectedTrip?.Taxi?.spaceForKayaks || 0;

    return (
        <div className="trip-container">
            {/* Filter Controls */}
            <div className="trip-filters">
                <label>
                    Year:
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="all">All</option>
                        {allYears.map(year => (
                            <option
                                key={year}
                                value={year}
                                disabled={(selectedMonth !== "all" || selectedDay !== "all") && !yearsWithMonthAndDay.includes(year)}
                            >
                                {year}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Month:
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        <option value="all">All</option>
                        {allMonths.map(month => (
                            <option
                                key={month}
                                value={month}
                                disabled={selectedDay !== "all" && !monthsWithSelectedDayAndYear.includes(month)}
                            >
                                {getMonthName(month)}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Day:
                    <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                        <option value="all">All</option>
                        {allDays.map(day => (
                            <option
                                key={day}
                                value={day}
                                disabled={selectedMonth !== "all" && !daysInSelectedMonthAndYear.includes(day)}
                            >
                                {day}
                            </option>
                        ))}
                    </select>
                </label>

                <button onClick={() => {
                    setSelectedYear("all");
                    setSelectedMonth("all");
                    setSelectedDay("all");
                }}>
                    Clear Filters
                </button>
            </div>

            {/* Trip List */}
            <div className="trip-list">
                {filteredTrips.map((trip, idx) => {
                    let isOverCapacity = false;

                    let currentPeople = trip.Reservations?.reduce((sum, res) => {
                        return sum + (res.Group?.numberOfPeople || 0);
                    }, 0) ?? 0;

                    let currentBoats = trip.Reservations?.reduce((resTotal, res) => {
                        return resTotal + (res.Boats?.reduce((bSum, boat) => bSum + (boat.numberOf || 0), 0) || 0);
                    }, 0) ?? 0;

                    let currentPeopleCapacity = trip.Taxi?.spaceForPeople || 0;
                    let currentBoatsCapacity = trip.Taxi?.spaceForKayaks || 0;

                    if (currentPeople > currentPeopleCapacity || currentBoats > currentBoatsCapacity) {
                        isOverCapacity = true;
                    }

                    return (
                        <div
                            key={trip.id}
                            className={`trip-item ${idx === selectedTripIndex ? "active" : ""} ${isOverCapacity ? "over-capacity" : ""}`}
                            onClick={() => setSelectedTripIndex(idx)}
                        >
                            {formatDate(trip.day)} – {trip.timeFrame}
                        </div>
                    );
                })}
            </div>

            {/* Trip Details */}
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
                                <a className="No-Style-Link" href={`/quick/edit/reservation/${res.id}`}><li key={res.id}>
                                    <div className="svg-container">

                                    Reserved by: {res.Group?.leader?.name}
                                    {res.Group?.numberOfPeople > 1 && (
                                        <>
                                           , and {res.Group.numberOfPeople - 1} others.
                                        </>
                                    )}

                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="270 200 210 210"><path d="M276.3 255L416.3 395M323.3 206.7L463.3 346.7M276 267L335 207M461.7 340.9V400.9M409.7 392.9H469.7" stroke="#000" stroke-width="17" fill="none"/></svg>
                                    </div>
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
                                </li></a>
                            ))}
                        </ol>
                    </>
                )}
            </div>
        </div>
    );
}

export default QuickTrip;
