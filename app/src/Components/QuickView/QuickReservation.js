import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/QuickReservation.css";

function QuickReservation() {
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [error, setError] = useState(false);
    const [days, setDays] = useState([]);

    // Filters for Year, Month, Day
    const [selectedYear, setSelectedYearHidden] = useState("all");
    const setSelectedYear = (value) => {
        setSelectedYearHidden(value);
        if (value === "all") {
            setSelectedMonth("all");
        }
    }
    const [selectedMonth, setSelectedMonthHidden] = useState("all");
    const setSelectedMonth = (value) => {
        setSelectedMonthHidden(value);
        if (value === "all") {
            setSelectedDay("all");
        }
    }
    const [selectedDay, setSelectedDay] = useState("all");

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

    useEffect(() => {
        if (selectedMonth === "all") {
          setDays([]);
        } else {
          const numberOfDays = new Date(selectedYear, Number(selectedMonth) + 1, 0).getDate()
          const dayArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);
          setDays(dayArray);
        }
    }, [selectedMonth, selectedYear]);

    // Filter logic: Filter reservations by selected year, month, day
    const filteredReservations = reservations.filter((res) => {

        const tripDays = res.Trips?.map((trip) => {
            let dayData = trip.day.split('T')[0].split('-');
            return new Date(dayData[0], dayData[1] - 1, dayData[2]);
        }).sort((a, b) => a - b);

        const checkDateInRange = (startDay, endDay) => {
            let boundStart;
            let boundEnd;
            let selectedDate;

            if (selectedYear === "all") {
                return true;
            } 
            
            if (selectedMonth === "all") {
                boundStart = new Date(startDay.getFullYear(), 0, 1);
                boundEnd = new Date(endDay.getFullYear(), 11, 31);
                selectedDate = new Date(selectedYear, 1, 2);
                if (selectedDate >= boundStart && selectedDate <= boundEnd) {
                    return true;
                } else {
                    return false;
                }
            }
            
            if (selectedDay === "all") {
                boundStart = new Date(startDay.getFullYear(), startDay.getMonth(), 1);
                boundEnd = new Date(endDay.getFullYear(), endDay.getMonth() + 1, 0);
                selectedDate = new Date(selectedYear, selectedMonth, 2);
                if (selectedDate >= boundStart && selectedDate <= boundEnd) {
                    return true;
                } else {
                    return false;
                }
            }

            selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
            boundStart = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate());
            boundEnd = new Date(endDay.getFullYear(), endDay.getMonth(), endDay.getDate());
            return selectedDate >= boundStart && selectedDate <= boundEnd; // The selected date is not within the range
        };


        return checkDateInRange(...tripDays);
    });

    if (loading) return <div>Loading reservations...</div>;
    if (error) return <div>{error}</div>;

    const selectedReservation = filteredReservations[selectedIndex];

    // Get unique years, months, and days from the reservation data
    const years = [...new Set(reservations.map(res => res.Trips[0]?.day.split('-')[0]))].sort();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      
    return (
        <div className="reservation-container">
            {/* Filters: Year, Month, Day */}
            <div className="reservation-filters">
                <div className="filter-group">
                    <label>Year</label>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="all">All</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Month</label>
                    <select 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        disabled={selectedYear === "all"}>
                        <option value="all">All</option>
                        {months.map((month, index) => (
                            <option key={month} value={index}>{month}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Day</label>
                    <select 
                        value={selectedDay} 
                        onChange={(e) => setSelectedDay(e.target.value)}
                        disabled={selectedMonth === "all"}>
                        <option value="all">All</option>
                        {days.map((day) => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Left Panel: Reservation List */}
            <div className="reservation-list">
                {filteredReservations.map((res, idx) => (
                    <div
                        key={idx}
                        className={`reservation-item ${idx === selectedIndex ? "active" : ""}`}
                        onClick={() => setSelectedIndex(idx)}
                    >
                        #{idx + 1} - {res.Group?.leader?.name || "No Leader"}
                    </div>
                ))}
            </div>

            {/* Right Panel: Reservation Details */}
            {selectedReservation && (<div className="reservation-details">
                <h2>Reservation #{selectedIndex + 1}</h2>
                <p><strong>Leader:</strong> {selectedReservation.Group?.leader?.name}</p>
                <p><strong>People:</strong> {selectedReservation.Group?.numberOfPeople}</p>
                
                <h4>Trips:</h4>
                <ul>
                    {selectedReservation.Trips?.map((trip, i) => (
                        <li key={i}>
                            {i === 0 && <strong>[Arrival]</strong>}
                            {i === 1 && <strong>[Departure]</strong>}
                            {trip.timeFrame}, {trip.day.split("T")[0]}
                        </li>
                    ))}
                </ul>
                
                {selectedReservation.Boats?.length > 0 && (
                    <>
                        <h4>Boats:</h4>
                        <ul>
                            {selectedReservation.Boats?.map((boat, i) => (
                                <li key={i}>
                                    {boat.numberOf} {boat.isRented ? "rented" : "personal"} {boat.type}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>)}
        </div>
    );
}

export default QuickReservation;
