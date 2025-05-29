import React, { useState, useRef, useCallback, useEffect } from "react";

import format from "date-fns/format";
import { subDays, addDays, min } from "date-fns";

import CustomCalendar from "./CustomCalendar";
import axiosAuth from "../authRequest";

import "../../assets/QuickTaxi.css"

const backendURL = process.env.REACT_APP_API_BASE_URL;

const monthHeight = 560;

function QuickTaxi() {
  const [taxis, setTaxis] = useState([]);
  const [selectedTaxiIndex, setSelectedTaxiIndex] = useState(-1); // -1 = All
  const [taxi, setTaxi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDayhidden] = useState(new Date());
  const setSelectedDay = (date, fromScroll = false) => {
    setSelectedDayhidden(date);
    if (!fromScroll) {
      setLastSelectedDay(date);
    }
  };
  const [lastSelectedDay, setLastSelectedDay] = useState(new Date());
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [viewType, setViewType] = useState(null);

  useEffect(() => {
    axiosAuth
      .get(`${backendURL}/taxis`)
      .then((response) => {
        response.data?.forEach((taxi) => {
          taxi?.Trips?.forEach((trip) => {
            const [year, month, day] = trip.day?.split("T")[0].split("-");
            trip.day = new Date(year, month - 1, day);
          });
        });
        setTaxis(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching taxis:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedTaxiIndex === -1) {
      setTaxi({ Trips: taxis.flatMap((t) => t.Trips || []) });
    } else {
      setTaxi(taxis[selectedTaxiIndex]);
    }
  }, [taxis, selectedTaxiIndex]);

  const events = (taxi?.Trips || [])
    .map((trip) => ({
      id: trip.id,
      title: `${selectedTaxiIndex === -1 ? `${trip.Taxi?.name || `Taxi #${trip.TaxiId}`}:` : ""} ${trip.timeFrame || "Trip"}`,
      start: trip.day,
      end: trip.day,
      time: trip.timeStart,
      originalTrip: trip,
    }))
    .sort((a, b) => a.time.localeCompare(b.time)); // sort in event list so i never need to sort again

  const handleTripClick = async (trip) => {
    let result = await axiosAuth.get(`${backendURL}/trips/${trip.id}`).catch((error) => alert(error));
    setSelectedTrip(result.data);
    setViewType("Trip");
  };

  const handleDayClick = (event) => {
    let clickEvent;

    // Ignore if action is "select"
    if (event?.action === "select") {
      return;
    }

    // Handle if event is an array and first item has an id
    if (Array.isArray(event)) {
      clickEvent = event[0];
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

  const sortedTaxis = [...taxis].sort((a, b) => {
    const nameA = a.name || `Taxi #${a.id}`;
    const nameB = b.name || `Taxi #${b.id}`;
    return nameA.localeCompare(nameB);
  });

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>{format(selectedDay, "MMMM yyyy")}</h2>

      {/* Taxi selector */}
      {viewType != "Trip" && (
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <label style={{ marginRight: "0.5rem" }}>Select Taxi:</label>
          <select value={selectedTaxiIndex} onChange={(e) => setSelectedTaxiIndex(Number(e.target.value))}>
            <option value={-1}>
              All Taxis ({taxis.reduce((sum, t) => sum + ((viewType == "Date" ? t.Trips?.filter((t) => t.day.setHours(0, 0, 0, 0) == selectedDay.setHours(0, 0, 0, 0)).length : t.Trips?.length) || 0), 0)} trips)
            </option>
            {sortedTaxis.map((taxi, index) => {
              const name = taxi.name || `Taxi #${taxi.id}`;
              return (
                <option key={taxi.id || index} value={taxis.indexOf(taxi)}>
                  {name} ({(viewType == "Date" ? taxi.Trips?.filter((t) => t.day.setHours(0, 0, 0, 0) == selectedDay.setHours(0, 0, 0, 0)).length : taxi.Trips?.length) || 0} trips)
                </option>
              );
            })}
          </select>
        </div>
      )}

      {viewType == "Trip" ? (
        <div className="day-view">
          <h3>Trip Details</h3>
          <p>
            <strong>Date:</strong> {new Date(selectedTrip.day?.split("T")[0].split("-")[0], selectedTrip.day?.split("T")[0].split("-")[1] - 1, selectedTrip.day?.split("T")[0].split("-")[2]).toDateString()}
          </p>
          <p>
            <strong>Time:</strong> {((Number(selectedTrip.timeStart?.split(":")?.[0]) + 11) % 12) + 1}:{selectedTrip.timeStart?.split(":")?.[1]} {Number(selectedTrip.timeStart?.split(":")?.[0]) > 11 ? "PM" : "AM"}
          </p>
          <p>
            <strong>Locations:</strong> From: {selectedTrip.fromPlace}, To: {selectedTrip.toPlace}
          </p>
          <strong>Reservations:</strong>{" "}
          {selectedTrip.Reservations?.map((reservation) => {
            return (
              <div style={{ backgroundColor: "#eee", padding: 20, marginBottom: 10, borderRadius: 30 }}>
                <p style={{ margin: 0 }}>Leader: {reservation?.Group?.leader?.name}</p>
                {reservation?.Group?.notes && (
                  <p style={{ margin: 0 }}>
                    <strong>Notes: {reservation?.Group?.notes}</strong>
                  </p>
                )}
                <p style={{ margin: 0 }}>Number of People: {reservation?.Group?.numberOfPeople}</p>
                <p style={{ margin: 0 }}>
                  Number of Boats:{" "}
                  {reservation?.Boats?.reduce((sum, boat) => {
                    return sum + (boat.isRented ? 0 : boat.numberOf);
                  }, 0)}
                </p>
              </div>
            );
          })}
          {selectedTrip.Taxi && (
            <p>
              <strong>Taxi id:</strong> {selectedTrip.Taxi.id}
            </p>
          )}
          <button onClick={() => setViewType("Date")}>Close</button>
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
              .filter((e) => e.end.setHours(0, 0, 0, 0) == selectedDay.setHours(0, 0, 0, 0))
              .map((trip, idx) => {
                let tempHours = trip.time?.split(":")?.[0];
                let tempMinutes = trip.time?.split(":")?.[1];
                let afterNoon = false;
                if (tempHours >= 12) {
                  afterNoon = true;
                }
                tempHours = ((Number(tempHours) + 11) % 12) + 1;

                let displayTime = `${tempHours}:${tempMinutes} ${afterNoon ? "PM" : "AM"}`;

                let numOfPeople = trip.originalTrip?.Reservations?.reduce((sum, reservation) => sum + (reservation?.Group?.numberOfPeople || 0), 0);
                let numOfBoats = trip.originalTrip?.Reservations?.reduce((sum, reservation) => {
                  let numberOfBoatsInReservation = reservation.Boats?.reduce((recersiveSum, boat) => recersiveSum + ((!boat?.isRented && boat?.numberOf) || 0), 0);
                  return sum + (numberOfBoatsInReservation || 0);
                }, 0);

                return (
                  <div key={idx} onClick={() => handleTripClick(trip)} style={{ backgroundColor: "#eee", padding: "10px", borderRadius: "10px", marginBottom: 10 }}>
                    <p style={{ margin: 0 }}>
                      {selectedTaxiIndex === -1 ? `${trip.originalTrip?.Taxi?.name || `Taxi #${trip.originalTrip?.TaxiId}`}: ` : ""}
                      {displayTime} ({numOfPeople > 1 ? `${numOfPeople} people` : "1 person"}, {`${numOfBoats} boat${numOfBoats !== 1 ? "s" : ""}`}) "{trip.originalTrip?.fromPlace}" to "{trip.originalTrip?.toPlace}"
                    </p>
                  </div>
                );
              })}
            <button onClick={() => setViewType(null)}>Close</button>
          </div>
        </>
      ) : (
        <CustomCalendar events={events} monthHeight={monthHeight} onDateClick={handleDayClick} onEventClick={handleDayClick} dateDisplay={setSelectedDay} selectedDate={setLastSelectedDay} currentDate={selectedDay} />
      )}

      {viewType != "Trip" && (
        <div>
          {viewType == "Date" && (
            <>
              <br />
              <br />
              <br />
            </>
          )}
          {(() => {
            let earliestDate = null;
            const upcomingEvents = events
              .sort((a, b) => a.start - b.start)
              .filter((event) => event.start > lastSelectedDay)
              .filter((event) => {
                if (earliestDate === null || event.start.getTime() === earliestDate.getTime()) {
                  earliestDate = event.start;
                  return true;
                }
                return false;
              })
              .map((event, idx) => {
                // Create a new Date to avoid mutating the original
                return <p key={idx}>{event.title}</p>;
              });

            return earliestDate ? (
              <div className="nextTrips">
                <h2>Next Trips On {earliestDate.toDateString()}:</h2>
                <div
                  onClick={() => {
                    setSelectedDay(earliestDate);
                    setViewType("Date");
                  }}
                  style={{ backgroundColor: "#eee", padding: 10, borderRadius: 25 }}>
                  {upcomingEvents}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
      {loading && <p>loading taxis...</p>}
    </div>
  );
}

export default QuickTaxi;
