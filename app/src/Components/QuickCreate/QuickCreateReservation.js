import React, { useEffect, useState } from "react";
import axiosAuth from "../authRequest";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/QuickCreateReservation.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function QuickCreateReservation() {
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [numberOfPeople, setNumOfPeople] = useState(1);
  const [notes, setNotes] = useState("");

  const [departureTrips, setDepartureTrips] = useState([{type: "departure", timeFrame: "", People: 1, Boats: 0 }]);
  const [arrivalTrips, setArrivalTrips] = useState([{type: "arrival", timeFrame: "", People: 1, Boats: 0 }]);
  const [people, setPeople] = useState([{}]);
  const [boats, setBoats] = useState([]);
  const [taxis, setTaxis] = useState([]);

  const [loading, setLoading] = useState(false);

  const deleteTrip = (type, index) => {
    if (type == "arrival") {
      setArrivalTrips((prevTrips) => prevTrips.filter((_, i) => i !== index));
    }else{
      setDepartureTrips((prevTrips) => prevTrips.filter((_, i) => i !== index));
    }
  }
  const editTripAtIndex = (type, index, newData) => {
    let updatedTrips = [];
    if (type == "arrival") {
      updatedTrips = [...arrivalTrips]
      updatedTrips[index] = { ...updatedTrips[index], ...newData };
      setArrivalTrips(updatedTrips);
    } else {
      updatedTrips = [...departureTrips]
      updatedTrips[index] = { ...updatedTrips[index], ...newData };
      setDepartureTrips(updatedTrips);
    }
  };
  const createTrip = (type, day) => {
    let newTrip = { day: day, type: type, timeFrame: "", People: 1, Boats: 0 };
    if (type == "arrival"){
      setArrivalTrips([...arrivalTrips, newTrip]);
    } else {
      setDepartureTrips([...departureTrips, newTrip]);
    }
  }

  const editPersonAtIndex = (index, newData) => {
    const updatedPeople = [...people];
    updatedPeople[index] = { ...updatedPeople[index], ...newData };
    setPeople(updatedPeople);
  };
  const deletePerson = (index) => {
    setPeople((prevPeople) => prevPeople.filter((_, i) => i !== index));
  };
  const createPerson = () => {
    const newPersonList = [...people, {}]; // create a new array with an empty object added
    setPeople(newPersonList);
  };

  const deleteBoat = (index) => {
    setBoats((prevBoats) => prevBoats.filter((_, i) => i !== index));
  };
  const editBoatAtIndex = (index, newData) => {
    const updatedBoats = [...boats];
    updatedBoats[index] = { ...updatedBoats[index], ...newData };
    setBoats(updatedBoats);
  };
  const createBoat = () => {
    const newBoatList = [...boats, { numberOf: "1" }]; // create a new array with an empty object added
    setBoats(newBoatList);
  };

  const [peopleShown, setPeopleShown] = useState(false);
  const togglePersonDropdown = () => {
    setPeopleShown(!peopleShown);
  };

  const [boatsShown, setBoatsShown] = useState(false);
  const toggleBoatDropdown = () => {
    setBoatsShown(!boatsShown);
  };

  const [tripsShown, setTripsShown] = useState(false);
  const toggleTripsDropdown = () => {
    setTripsShown(!tripsShown);
  };

  const clearInputs = () => {
    document.querySelectorAll("input").forEach((inputEl) => {
      inputEl.value = "";
    });
    document.querySelectorAll('[type="checkbox"]').forEach((checkboxEl) => {
      checkboxEl.checked = false;
    });
  };

  useEffect(() => {
    axiosAuth
      .get(`${backendURL}/taxis`)
      .then((response) => response.data)
      .then((data) => {
        setTaxis(data || []);
      })
      .catch((error) => {
        console.error("Error fetching taxis:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare payload to send to the backend
    const payload = {
      arrivalTrips: arrivalTrips.map((at) => ({
        day: at.day,
        timeStart: at.timeStart,
        fromPlace: at.fromPlace,
        toPlace: at.toPlace,
        type: "arrival",
        timeFrame: at.timeFrame || "",
        People: Number(at.People) || 1,
        Boats: Number(at.Boats) || 0,
      })),
      departureTrips: departureTrips.map((dt) => ({
        day: dt.day,
        timeStart: dt.timeStart,
        fromPlace: dt.fromPlace,
        toPlace: dt.toPlace,
        type: "departure",
        timeFrame: dt.timeFrame || "",
        People: Number(dt.People) || 1,
        Boats: Number(dt.Boats) || 0,
      })),
      // arrivalDay: trips?.[0]?.day,
      // arrivalSchedule: trips?.[0]?.timeFrame,
      // arrivalTime: (trips?.[0]?.timeFrame?.startsWith("Custom") || trips?.[0]?.timeFrame.startsWith("Paddle")) ? trips?.[0]?.timeStart : undefined,
      // arrivalFromPlace: trips?.[0]?.timeFrame?.startsWith("Custom") ? trips?.[0]?.fromPlace : undefined,
      // arrivalToPlace: trips?.[0]?.timeFrame?.startsWith("Custom") ? trips?.[0]?.toPlace : undefined,
      // departureDay: trips?.[1]?.day,
      // departureSchedule: trips?.[1]?.timeFrame,
      // departureTime: (trips?.[1]?.timeFrame.startsWith("Custom") || trips?.[1]?.timeFrame.startsWith("Paddle")) ? trips?.[1]?.timeStart : undefined,
      // departureFromPlace: trips?.[1]?.timeFrame.startsWith("Custom") ? trips?.[1]?.fromPlace : undefined,
      // departureToPlace: trips?.[1]?.timeFrame.startsWith("Custom") ? trips?.[1]?.toPlace : undefined,
      numberOfPeople: Number(numberOfPeople) || 1,
      notes: notes || "",
      people: people.map((p) => ({
        name: p.name || "",
        allergies: p.allergies || "",
      })),
      boats: boats.map((b) => ({
        type: b.type || "",
        numberOf: Number(b.numberOf) || 1,
        rented: b.isRented || false,
      })),
    };

    try {
      // Send the data to the backend for validation and creation
      const response = await axiosAuth.post(`${backendURL}/quick`, payload);
      // Handle success - inform the user and redirect
      alert("Reservation created successfully. Redirecting...");
      navigate("/quick/reservation");
    } catch (error) {
      // Handle error - show the error message from the backend
      console.error("Error creating reservation:", error);
      // show error message, or default error if missing
      alert(error.response?.data?.error || "An error occurred while creating the reservation. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>New Reservation</h1>

      <form className="quickReservationForm" onSubmit={handleSubmit}>
        <label>Reservation Name:</label>
        <input className="quickPeopleInputText" type="text" id="reservationName" value={people[0]?.name} onChange={(e) => editPersonAtIndex(0, { name: e.target.value })} required />

        <label>Number of People:</label>
        <input className="quickPeopleInputNumber" type="number" id="numberOfPeople" value={numberOfPeople} onChange={(e) => setNumOfPeople(Number(e.target.value))} min="1" required />

        <label>Notes for trips:</label>
        <input className="quickPeopleInputNumber" type="text" id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div>
          <button type="button" onClick={togglePersonDropdown}>
            {peopleShown ? "Hide People ▲" : "Show People ▼"}
          </button>
          {peopleShown && (
            <div className="dropdown-content" style={{ marginTop: "10px" }}>
              {people.map((person, index) => (
                <div key={index} className={`Person-Object`}>
                  {index !== 0 && (
                    <>
                      {people.length > numberOfPeople && <div className="error">TOO MANY PEOPLE</div>}
                      <button
                        type="button"
                        className={(people.length > numberOfPeople && "Delete") || "next"}
                        onClick={() => {
                          clearInputs();
                          deletePerson(index);
                        }}>
                        Delete
                      </button>
                    </>
                  )}
                  <label>
                    Name:
                    <input type="text" value={person.name} onChange={(e) => editPersonAtIndex(index, { name: e.target.value })} />
                  </label>
                  <label>
                    Allergies:
                    <input type="text" value={person.allergies} onChange={(e) => editPersonAtIndex(index, { allergies: e.target.value })} />
                  </label>
                </div>
              ))}
              {numberOfPeople > people.length && (
                <button type="button" onClick={createPerson} className="next">
                  +
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <label>Number of Boats: {boats?.map((boat) => Number(boat.numberOf)).reduce((sum, current) => sum + current, 0)}</label>
          <button type="button" onClick={toggleBoatDropdown}>
            {boatsShown ? "Hide Boats ▲" : "Show Boats ▼"}
          </button>
          {boatsShown && (
            <>
              {boats?.map((boat, index) => (
                <div key={boat.id || index} className={`Boat-Object`}>
                  <button
                    type="button"
                    className="next"
                    onClick={() => {
                      clearInputs();
                      deleteBoat(index);
                    }}>
                    Delete
                  </button>
                  <label>
                    Type:
                    <select value={boat.type || ""} onChange={(e) => editBoatAtIndex(index, { type: e.target.value })} required>
                      <option value="" disabled>
                        -- Select Type --
                      </option>
                      <option value="Single Kayaks">Single Kayaks</option>
                      <option value="XL Single Kayaks">XL Single Kayaks</option>
                      <option value="Double Kayaks">Double Kayaks</option>
                      <option value="XL Double Kayaks">XL Double Kayaks</option>
                      <option value="Canoes">Canoes</option>
                    </select>
                  </label>
                  <label>
                    Boats are rented:
                    <input type="checkbox" className="inline" checked={boat.isRented} onChange={(e) => editBoatAtIndex(index, { isRented: e.target.checked })} />
                  </label>
                  <label>
                    Number of Boats of this type:
                    <input
                      type="number"
                      className="inline"
                      value={boat.numberOf}
                      onChange={(e) =>
                        editBoatAtIndex(index, {
                          numberOf: parseInt(e.target.value, 10),
                        })
                      }
                      min="1"
                      required
                    />
                  </label>
                </div>
              ))}
              <br />
              <button type="button" onClick={createBoat} className="next">
                +
              </button>
            </>
          )}
        </div>

        <div>
          <button type="button" onClick={toggleTripsDropdown}>
            {tripsShown ? "Hide Trips ▲" : "Show Trips ▼"}
          </button>

          {tripsShown && (
            <div className="dropdown-content" style={{ marginTop: "10px" }}>
              {[arrivalTrips, departureTrips].map((trips, idx) => {
                let multipleTrips = false;
                if (trips.length >= 2) {
                  multipleTrips = true;
                }

              let numberOfPeopleOnTrips = trips.reduce((sum, current) => {return (current.People || 1)+sum;}, 0);
              let numberOfBoatsOnTrips = trips.reduce((sum, current) => {return (current.Boats || 0)+sum;}, 0);
              let numberOfPersonalBoats = boats.reduce((sum, current) => {
                if (current.isRented) {
                  return sum;
                } else {
                  return Number(sum + current.numberOf);
                }
              }, 0)
              return (<div key={idx}> {idx == 1 && <br/>} { trips.map((trip, index) => {
                return (
                  <div key={index} className={`quick-create-Trip-Object ${index >= numberOfPeople && "error" || ""}`}>
                    <h3>{(trip.type == "arrival" && "Arival") || "Departure"}:

                    {index == 0 && (<button type="button" className="space-left blue" onClick={()=>{createTrip(trip.type, trip.day)}}>Add {(trip.type == "arrival" && "Arival") || "Departure"} Trip</button>)
                    || (<button className="space-left red" onClick={()=>{deleteTrip(trip.type, index)}}>Remove Trip</button>)}</h3>

                    {index >= numberOfPeople && (<>Cannot have more trips than people</>)}
                    <label>
                      day:
                      <input type="date" value={trip.day?.split("T")[0]} onChange={(e) => editTripAtIndex(trip.type, index, { day: e.target.value })} required />
                    </label>

                    <label>
                      Time Frame:
                      <select className="editTripInputSelect" id="timeFrame" value={trip.timeFrame} onChange={(e) => editTripAtIndex(trip.type, index, { timeFrame: e.target.value })} required>
                        <option value="" disabled>
                          -- select a timeframe --
                        </option>
                        <option value="Custom AM">Custom AM</option>
                        <option value={(trip.type == "arrival" && "Secret to Lodge AM") || "Lodge to Secret AM"}>{(trip.type == "arrival" && "Secret to Lodge AM") || "Lodge to Secret AM"}</option>
                        <option value="Custom">Custom</option>
                        <option value={(trip.type == "arrival" && "Secret to Lodge PM") || "Lodge to Secret PM"}>{(trip.type == "arrival" && "Secret to Lodge PM") || "Lodge to Secret PM"}</option>
                        <option value="Custom PM">Custom PM</option>
                        <option value={(trip.type == "arrival" && "Paddle In") || "Paddle Out"}>{(trip.type == "arrival" && "Paddle In") || "Paddle Out"}</option>
                      </select>
                    </label>

                    {(trip.timeFrame?.startsWith("Custom") || trip.timeFrame?.startsWith("Paddle")) && (
                      <>
                        <label>
                          Time:
                          <input className="editTripInputTime" type="time" id="timeStart" value={trip.timeStart} onChange={(e) => editTripAtIndex(trip.type, index, { timeStart: e.target.value })} required />
                        </label>
                        {trip.timeFrame?.startsWith("Custom") && (
                          <>
                            <label>
                              From Place:
                              <input className="editTripInputText" type="text" id="fromPlace" value={trip.fromPlace} onChange={(e) => editTripAtIndex(trip.type, index, { fromPlace: e.target.value })} required />
                            </label>

                            <label>
                              To Place:
                              <input className="editTripInputText" type="text" id="toPlace" value={trip.toPlace} onChange={(e) => editTripAtIndex(trip.type, index, { toPlace: e.target.value })} required />
                            </label>
                          </>
                        )}
                      </>
                    )}

                    {multipleTrips && (
                      <>
                    {numberOfPeopleOnTrips != numberOfPeople && (<div className="warning">Warning: {numberOfPeopleOnTrips} / {numberOfPeople} people are chosen to go on these trips</div>)}
                    <label>Number of People on Trip:
                    <input className="quickPeopleInputNumber" max={Math.max(numberOfPeople-numberOfPeopleOnTrips+trip.People, 1)} type="number" id="tripPeople" value={trip.People} onChange={(e) => editTripAtIndex(trip.type, index, { People: (Number(e.target.value) || 1)})} min="1" required />
                    </label>

                    {numberOfBoatsOnTrips != numberOfPersonalBoats && (<div className="warning">Warning: {numberOfBoatsOnTrips} / {numberOfPersonalBoats} boats are chosen to go on these trips</div>)}
                    {trip.timeFrame.startsWith("Paddle") && trip.Boats < 1 && (<div className="error">Warning: People Must have a boat to paddle {trip.type == "arrival" && "in" || "out"} on</div>)}
                    <label>Number of Boats on Trip:
                    <input className="quickPeopleInputNumber" max={Math.max(numberOfPersonalBoats-numberOfBoatsOnTrips+trip.Boats, 0)} type="number" id="tripBoats" value={trip.Boats} onChange={(e) => editTripAtIndex(trip.type, index, { Boats: (Number(e.target.value) || 0)})} min={trip.timeFrame.startsWith("Paddle") && 1 || 0} required />
                    </label>
                    </>
                    )
                    }
                  </div>
                );
              })}</div>)})}
            </div>
          )}
        </div>

        <button type="submit" className={!loading && "next" || ""} disabled={loading}>
          {loading ? "Loading..." : "Create New Reservation"}
        </button>
      </form>
    </div>
  );
}

export default QuickCreateReservation;
