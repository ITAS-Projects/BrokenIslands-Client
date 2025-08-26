import React, { useEffect, useState } from "react";
import axiosAuth from "../authRequest";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/QuickCreateTrip.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function QuickCreateTrip() {
  const navigate = useNavigate();
  const [numberOfPeople, setNumOfPeople] = useState(1);

  const [trip, setTrip] = useState({ timeFrame: "" });  
  const [notes, setNotes] = useState("");
  const [people, setPeople] = useState([{}]);
  const [boats, setBoats] = useState([]);
  const [taxis, setTaxis] = useState([]);

  const [loading, setLoading] = useState(false);

  const editTrip = (newData) => {
    let updatedTrip = trip;
    updatedTrip = { ...updatedTrip, ...newData };
    setTrip(updatedTrip);
  };

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
    const newBoatList = [...boats, { numberOf: "1", isRented: false }]; // create a new array with an empty object added
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
      trip: trip,
      notes: notes,
      numberOfPeople: numberOfPeople,
      people: people.map((p) => ({
        name: p.name,
      })),
      boats: boats.map((b) => ({
        type: b.type,
        numberOf: Number(b.numberOf),
        isRented: false,
      })),
    };

    try {
      // Send the data to the backend for validation and creation
      const response = await axiosAuth.post(`${backendURL}/oneWayTrips`, payload);
      // Handle success - inform the user and redirect
      alert("Trip created successfully. Redirecting...");
      navigate("/quick/trip");
    } catch (error) {
      // Handle error - show the error message from the backend
      console.error("Error creating trip:", error);
      // show error message, or default error if missing
      alert(error.response?.data?.error || "An error occurred while creating the trip. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>New Trip</h1>

      <form className="quickTripForm" onSubmit={handleSubmit}>
        <label>
          Trip Leader:
          <input className="quickPeopleInputText" type="text" id="tripName" value={people[0]?.name} onChange={(e) => editPersonAtIndex(0, { name: e.target.value })} required />
        </label>

        <label>
          Number of People:
          <input className="quickPeopleInputNumber" type="number" id="numberOfPeople" value={numberOfPeople} onChange={(e) => setNumOfPeople(Number(e.target.value))} min="1" required />
        </label>

        <label>
          Notes/Reason for trip:
          <input className="quickPeopleInputNumber" type="text" id="reason" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>

        <label>
          day:
          <input type="date" value={trip.day?.split("T")[0]} onChange={(e) => editTrip({ day: e.target.value })} required />
        </label>

        <label>
          Time Frame:
          <select className="editTripInputSelect" id="timeFrame" value={trip.timeFrame} onChange={(e) => editTrip({ timeFrame: e.target.value })} required>
            <option value="" disabled>
              -- select a timeframe --
            </option>
            <option value="Custom AM">Custom AM</option>
            <option value="Custom">Custom</option>
            <option value="Custom PM">Custom PM</option>
          </select>
        </label>

        <label>
          Time:
          <input className="editTripInputTime" type="time" id="timeStart" value={trip.timeStart} onChange={(e) => editTrip({ timeStart: e.target.value })} required />
        </label>

        <label>
          From Place:
          <input className="editTripInputText" type="text" id="fromPlace" value={trip.fromPlace} onChange={(e) => editTrip({ fromPlace: e.target.value })} required />
        </label>

        <label>
          To Place:
          <input className="editTripInputText" type="text" id="toPlace" value={trip.toPlace} onChange={(e) => editTrip({ toPlace: e.target.value })} required />
        </label>

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

        <button type="submit" className={!loading && "next"} disabled={loading}>
          {loading ? "Loading..." : "Create New Trip"}
        </button>
      </form>
    </div>
  );
}

export default QuickCreateTrip;
