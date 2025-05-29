import React, { useState, useRef, useCallback, useEffect } from "react";

import format from "date-fns/format";
import { subDays, addDays, min, startOfDay, endOfDay } from "date-fns";

import CustomCalendar from "./CustomCalendar";
import axiosAuth from "../authRequest";

const backendURL = process.env.REACT_APP_API_BASE_URL;

const monthHeight = 560;

function QuickAllergy() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [viewType, setViewType] = useState(null);

  useEffect(() => {
    axiosAuth
      .get(`${backendURL}/reservations`)
      .then((response) => {
        response.data?.map((reservation) => {
          const timeOrder = ["Custom AM", "Lodge to Secret AM", "Secret to Lodge AM", "Custom", "Lodge to Secret PM", "Secret to Lodge PM", "Custom PM"];
          let orderTrips = reservation.Trips;
          orderTrips?.sort((a, b) => {
            let dayData = a.day?.split("T")[0].split("-");
            let dayData2 = b.day?.split("T")[0].split("-");

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

            return timeOrder.findIndex((item) => item === a.timeFrame) - timeOrder.findIndex((item) => item === b.timeFrame);
          });

          let startYear = Number(orderTrips[0].day.split("T")[0].split("-")[0]);
          let startMonth = Number(orderTrips[0].day.split("T")[0].split("-")[1]);
          let startDay = Number(orderTrips[0].day.split("T")[0].split("-")[2]);

          let endYear = Number(orderTrips[1].day.split("T")[0].split("-")[0]);
          let endMonth = Number(orderTrips[1].day.split("T")[0].split("-")[1]);
          let endDay = Number(orderTrips[1].day.split("T")[0].split("-")[2]);

          reservation.start = startOfDay(new Date(startYear, startMonth - 1, startDay));
          reservation.end = endOfDay(new Date(endYear, endMonth - 1, endDay));
          return reservation;
        });
        setReservations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching taxis:", error);
        setLoading(false);
      });
  }, [selectedReservation]);

  const handleShowDurationClick = () => {
    setViewType(null);
  };

  const handleDayClick = (event) => {
    let clickEvent;
    // Ignore if action is "select"
    if (event?.action === "select") {
      return;
    }
    // If no action/id, assume it's a raw date
    else if (event?.action || event?.id) {
      clickEvent = event;
    }
    // Otherwise assume it's a normal event object
    else {
      clickEvent = { start: event };
    }

    setSelectedDay(clickEvent.start);
    setViewType("Date");
  };

  const handleEventClick = (e) => {
    const newReservation = events.find((reservation) => reservation.id === e.id);
    setSelectedReservation(newReservation);
    setSelectedDay(e.start);
    setViewType("Reservation");
  };

  let events = (reservations || [])
    .map((reservation, idx) => {
      return {
        id: idx,
        leader: reservation.Group?.leader?.name || "Unknown",
        title: `Leader: ${reservation.Group?.leader?.name || "Unknown"}`,
        start: reservation.start,
        end: reservation.end,
        originalReservation: reservation,
      };
    })
    .sort((a, b) => {
      return a.start - b.start;
    })
    .filter((event) => {
      const people = event.originalReservation?.Group?.People || [];
      return people.some(person => person.allergies && person.allergies.trim() !== "") && (selectedReservation ? selectedReservation.id == event.id : true);
    });

  function splitMultiDayEvents(events) {
    const splitEvents = [];

    events
      .forEach((event) => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const current = new Date(start);

        while (current <= end) {
          splitEvents.push({
            ...event,
            start: new Date(current),
            end: new Date(current.getFullYear(), current.getMonth(), current.getDate(), 23, 59, 59),
          });
          current.setDate(current.getDate() + 1);
        }
      });

    return splitEvents;
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>{format(selectedDay, "MMMM yyyy")}</h2>

      {viewType == "Reservation" ? (
        <div className="day-view">
          <h3>Reservation Details</h3>
          <p>
            <strong>Leader:</strong> {selectedReservation.originalReservation?.Group?.leader?.name}
          </p>
          <p>
            <strong>Start Date:</strong> {selectedReservation.start.toDateString()}
          </p>
          <p>
            <strong>End Date:</strong> {selectedReservation.end.toDateString()}
          </p>
          <strong>People with Allargies:</strong>{" "}
          {selectedReservation.originalReservation?.Group?.People?.filter((person) => {
            return person.allergies && person.allergies.trim() !== "";
          }).map((person) => {
            return (
              <div style={{ backgroundColor: "#eee", padding: 10, marginBottom: 10, borderRadius: 20 }}>
                <p style={{ margin: 0 }}>Name: {person.name}</p>
                <p style={{ margin: 0 }}>Allergies: {person?.allergies}</p>
              </div>
            );
          })}
          <br />
          <button onClick={handleShowDurationClick}>Show Time Duration</button>
          <br />
          <button
            onClick={() => {
              setViewType("Date");
              setSelectedReservation(null);
            }}>
            Close
          </button>
        </div>
      ) : viewType == "Date" ? (
        <>
          <div className="day-view">
            <h3>Trips On {selectedDay.toDateString()}</h3>
            <div className="DateNavigation">
              <button
                onClick={() => {
                  setSelectedDay(subDays(selectedDay, 1));
                }}>
                Previous Day
              </button>

              <button
                onClick={() => {
                  setSelectedDay(new Date());
                }}>
                Today
              </button>

              <button
                onClick={() => {
                  setSelectedDay(addDays(selectedDay, 1));
                }}>
                Next Day
              </button>
            </div>
            {events
              .filter((e) => e.end.setHours(23, 0, 0, 0) > selectedDay.setHours(12, 0, 0, 0) && e.start.setHours(0, 0, 0, 0) < selectedDay.setHours(12, 0, 0, 0))
              .map((reservation, idx) => {
                const peopleWithAllergies = reservation.originalReservation?.Group?.People?.filter((person) => person.allergies && person.allergies.trim() !== "")?.length || 0;

                return (
                  <div key={idx} onClick={() => handleEventClick(reservation)} style={{ backgroundColor: "#eee", padding: "10px", borderRadius: "10px", marginBottom: 10 }}>
                    <p style={{ margin: 0 }}>
                      Leader: {reservation.originalReservation?.Group?.leader?.name || "Unknown"}, People with allergies: {peopleWithAllergies}
                    </p>
                  </div>
                );
              })}
            <button onClick={() => setViewType(null)}>Close</button>
          </div>
        </>
      ) : (
        <>
        {selectedReservation && <button onClick={() => setSelectedReservation(null)}>Unselect reservation</button>}
        <CustomCalendar
          events={selectedReservation ? events : splitMultiDayEvents(events)}
          monthHeight={monthHeight}
          onDateClick={handleDayClick}
          onEventClick={handleEventClick}
          dateDisplay={setSelectedDay}
          currentDate={selectedDay}
        />
        </>
      )}
      {loading && <p>loading taxis...</p>}
    </div>
  );
}

export default QuickAllergy;
