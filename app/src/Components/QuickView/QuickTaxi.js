import React, { useEffect, useState } from "react";
import axiosAuth from "../authRequest";
import "../../assets/QuickTaxi.css";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function QuickTaxi() {
    const [taxis, setTaxis] = useState([]);
    const [selectedTaxiIndex, setSelectedTaxiIndex] = useState(0);
    const [taxi, setTaxi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState("week");
    const [selectedTrip, setSelectedTrip] = useState(null);
    const handle = useFullScreenHandle();

    useEffect(() => {
        axiosAuth
            .get(`${backendURL}/taxis`)
            .then((response) => {
                setTaxis(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching taxis:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setTaxi(taxis[selectedTaxiIndex]);
    }, [taxis, selectedTaxiIndex]);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const normalizeToLocalMidnight = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const dayOfWeek = d.getDay(); // Sunday = 0
        const start = new Date(d);
        start.setDate(d.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        return start;
    };

    const startOfWeek = getStartOfWeek(currentDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const tripsForTheWeek = (taxi?.Trips || [])
        .filter((trip) => {
            const tripDate = normalizeToLocalMidnight(trip.day);
            tripDate.setDate(tripDate.getDate() +1);
            return tripDate >= startOfWeek && tripDate <= endOfWeek;
        })
        .sort((a, b) => new Date(a.day) - new Date(b.day));

    const dayTrips =
        taxi?.Trips?.filter(
            (trip) =>{
                const tripDate = normalizeToLocalMidnight(trip.day);
                tripDate.setDate(tripDate.getDate() + 1);
                return tripDate.getTime() === normalizeToLocalMidnight(currentDate).getTime();
            }
        ).sort((a, b) => {
            const order = [
                "Custom AM",
                "Lodge to Secret AM",
                "Secret to Lodge AM",
                "Custom",
                "Lodge to Secret PM",
                "Secret to Lodge PM",
                "Custom PM",
            ];
            return order.indexOf(a.timeFrame) - order.indexOf(b.timeFrame);
        }) || [];

    let upcomingTrips = (taxi?.Trips || [])
        .sort((a, b) => new Date(a.day) - new Date(b.day))
        .filter((trip) => new Date(trip.day) > currentDate);

    upcomingTrips = upcomingTrips.filter(
        (trip) => new Date(trip.day) <= new Date(upcomingTrips?.[0]?.day)
    );

    const handleTripClick = (trip) => {
        let trip_fix = new Date(trip.day);
        trip_fix.setDate(trip_fix.getDate() + 1);
        setCurrentDate(trip_fix);
        setSelectedTrip(trip);
        setViewMode("day");
    };

    const handleDateChange = (date) => {
        setCurrentDate(date);
        setViewMode("day");
    };

    const navigateDays = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + direction);
        setCurrentDate(newDate);
    };

    if (loading) return <div>Loading taxis...</div>;

    return (
        <FullScreen handle={handle}>
            <div className="taxi-container">
                {/* Sidebar */}
                <div className="sidebar">
                    <button onClick={handle.active ? handle.exit : handle.enter}>
                        {handle.active ? "Exit Full Screen" : "Go Full Screen"}
                    </button>
                    <br />

                    <FormControl fullWidth>
                        <InputLabel>Taxi</InputLabel>
                        <Select
                            value={selectedTaxiIndex}
                            onChange={(e) => setSelectedTaxiIndex(e.target.value)}
                            label="Taxi"
                        >
                            {taxis.map((t, idx) => (
                                <MenuItem key={t.id} value={idx}>
                                    {t.name || `Taxi #${t.id}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <DatePicker
                        selected={currentDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        showYearDropdown
                        scrollableYearDropdown
                        showPopperArrow={false}
                        className="date-picker"
                    />

                    <div className="view-toggle">
                        <button
                            className={viewMode === "day" ? "active" : ""}
                            onClick={() => setViewMode("day")}
                        >
                            Day View
                        </button>
                        <button
                            className={viewMode === "week" ? "active" : ""}
                            onClick={() => setViewMode("week")}
                        >
                            Week View
                        </button>
                    </div>
                </div>

                {/* Main content */}
                <div className="main-content">
                    {taxi && (
                        <>
                            <h2>{taxi.name || `Taxi #${taxi.id}`}</h2>
                            <p>
                                Capacity: {taxi.spaceForPeople} people & {taxi.spaceForKayaks} boats
                            </p>

                            {viewMode === "week" && (
                                <>
                                    <div className="week-navigation">
                                        <button onClick={() => navigateDays(-7)}>Previous Week</button>
                                        <button onClick={() => setCurrentDate(new Date())}>Today</button>
                                        <button onClick={() => navigateDays(7)}>Next Week</button>
                                    </div>
                                    <div className="day-navigation">
                                        <button onClick={() => navigateDays(-1)}>Previous Day</button>
                                        <button onClick={() => navigateDays(1)}>Next Day</button>
                                    </div>
                                    <br />
                                    <div className="week-view">
                                        {Array.from({ length: 7 }).map((_, i) => {
                                            const day = new Date(startOfWeek);
                                            day.setDate(startOfWeek.getDate() + i);

                                            const tripsForDay = tripsForTheWeek.filter(
                                                (trip) => {
                                                    const tripDate = normalizeToLocalMidnight(trip.day);
                                                    tripDate.setDate(tripDate.getDate() + 1);
                                                    return tripDate.getTime() === normalizeToLocalMidnight(day).getTime();
                                                }
                                            );

                                            return (
                                                <div
                                                    key={i}
                                                    className={`day-cell ${
                                                        normalizeToLocalMidnight(day).getTime() ===
                                                        normalizeToLocalMidnight(currentDate).getTime()
                                                            ? "SelectedDay"
                                                            : ""
                                                    }`}
                                                    onClick={() => setCurrentDate(day)}
                                                >
                                                    <strong>{day.toLocaleDateString()}</strong>
                                                    {tripsForDay.length > 0 ? (
                                                        <ul>
                                                            {tripsForDay.map((trip) => (
                                                                <li
                                                                    key={trip.id}
                                                                    onClick={() => handleTripClick(trip)}
                                                                >
                                                                    {trip.timeFrame}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>No trips</p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {viewMode === "day" && (
                                <div className="day-view">
                                    <h3>Trips on {formatDate(currentDate)}</h3>
                                    <div className="day-navigation">
                                        <button onClick={() => navigateDays(-1)}>Previous Day</button>
                                        <button onClick={() => setCurrentDate(new Date())}>Today</button>
                                        <button onClick={() => navigateDays(1)}>Next Day</button>
                                    </div>
                                    {dayTrips.length > 0 ? (
                                        <table className="trips-table">
                                            <thead>
                                                <tr>
                                                    <th>Time Frame</th>
                                                    <th>Time</th>
                                                    <th>People</th>
                                                    <th>Boats</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dayTrips.map((trip) => {
                                                    const scheduleToTime = {
                                                            "Lodge to Secret AM": "9:15 AM",
                                                            "Secret to Lodge AM": "10:15 AM",
                                                            "Lodge to Secret PM": "15:15 PM",
                                                            "Secret to Lodge PM": "16:00 PM"
                                                        };

                                                    const formatTime = (schedule, timeStr) => {
                                                        if (!schedule.startsWith("Custom")) {
                                                            return scheduleToTime[schedule] || "-";
                                                        };
                                                        const [hourStr, minute] = timeStr?.split(":") || ['0','0'];
                                                        const hour = Number(hourStr);
                                                        const formattedHour = ((hour + 11) % 12) + 1;
                                                        const period = hour < 12 ? "AM" : "PM";
                                                        return `${formattedHour}:${minute} ${period}`;
                                                    };

                                                    const people = trip.Reservations?.reduce(
                                                        (sum, res) => sum + (res.Group?.numberOfPeople || 0),
                                                        0
                                                    );

                                                    const boats = trip.Reservations?.reduce(
                                                        (sum, res) =>
                                                            sum +
                                                            (res.Boats?.reduce(
                                                                (bSum, b) => bSum + (b.numberOf || 0),
                                                                0
                                                            ) || 0),
                                                        0
                                                    );

                                                    return (
                                                        <tr key={trip.id}>
                                                            <td>{trip.timeFrame}</td>
                                                            <td>
                                                                {formatTime(trip.timeFrame, trip.timeStart)}
                                                            </td>
                                                            <td>{people}</td>
                                                            <td>{boats}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>No trips today.</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Upcoming Trips Sidebar */}
                <div className="upcoming-trips">
                    <h3>Upcoming Trips</h3>
                    <ul>
                        {upcomingTrips.map((trip) => {
                            return (
                            <li key={trip.id} onClick={() => handleTripClick(trip)}>
                                {new Date(trip.day).toLocaleDateString()} - {trip.timeFrame}
                            </li>
                        )})}
                    </ul>
                </div>
            </div>
        </FullScreen>
    );
}

export default QuickTaxi;
