import React, { useState, useRef, useCallback, useEffect } from "react";

import format from "date-fns/format";
import CustomCalendar from "./CustomCalendar";
import axiosAuth from "../authRequest";

const backendURL = process.env.REACT_APP_API_BASE_URL;

const monthHeight = 560;

function QuickTaxi() {
  const [taxis, setTaxis] = useState([]);
  const [selectedTaxiIndex, setSelectedTaxiIndex] = useState(-1); // -1 = All
  const [taxi, setTaxi] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);

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

  const events = (taxi?.Trips || []).map((trip, index) => ({
    id: trip.id || index,
    title: selectedTaxiIndex === -1 ? `${trip.Taxi?.name || `Taxi #${trip.TaxiId}`}: ${trip.timeFrame || "Trip"}` : trip.description || "Trip",
    start: trip.day,
    end: trip.day,
    originalTrip: trip,
  }));

  const handleTripClick = (event) => {
    setSelectedTrip(event.originalTrip);
  };

  const sortedTaxis = [...taxis].sort((a, b) => {
    const nameA = a.name || `Taxi #${a.id}`;
    const nameB = b.name || `Taxi #${b.id}`;
    return nameA.localeCompare(nameB);
  });

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>{format(currentMonth, "MMMM yyyy")}</h2>

      {/* Taxi selector */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <label style={{ marginRight: "0.5rem" }}>Select Taxi:</label>
        <select value={selectedTaxiIndex} onChange={(e) => setSelectedTaxiIndex(Number(e.target.value))}>
          <option value={-1}>All Taxis ({taxis.reduce((sum, t) => sum + (t.Trips?.length || 0), 0)} trips)</option>
          {sortedTaxis.map((taxi, index) => {
            const name = taxi.name || `Taxi #${taxi.id}`;
            return (
              <option key={taxi.id || index} value={taxis.indexOf(taxi)}>
                {name} ({taxi.Trips?.length || 0} trips)
              </option>
            );
          })}
        </select>
      </div>
      
      {selectedTrip ? (
        <div className="day-view">
          <h3>Trip Details</h3>
          <p>
            <strong>Date:</strong> {selectedTrip.day.toDateString()}
          </p>
          <p>
            <strong>Description:</strong> {selectedTrip.description}
          </p>
          <p>
            <strong>Trip ID:</strong> {selectedTrip.id}
          </p>
          {selectedTrip.Taxi && (
            <p>
              <strong>Taxi:</strong> {selectedTrip.Taxi.name || selectedTrip.Taxi.id}
            </p>
          )}
          <button onClick={() => setSelectedTrip(null)}>Close</button>
        </div>
      ) : (
        <CustomCalendar events={events} monthHeight={monthHeight} onEventClick={handleTripClick} dateDisplay={setCurrentMonth} currentDate={currentMonth} />
      )}
      {loading && (<p>loading taxis...</p>)}
    </div>
  );
}

export default QuickTaxi;
