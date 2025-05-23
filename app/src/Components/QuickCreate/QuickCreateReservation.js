import React, { useEffect, useState } from "react";
import axiosAuth from "../authRequest";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/QuickCreateReservation.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function QuickCreateReservation() {
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [numberOfPeople, setNumOfPeople] = useState(1);

    const [trips, setTrips] = useState([{timeFrame: ""},{timeFrame: ""}]);
    const [people, setPeople] = useState([{}]);
    const [boats, setBoats] = useState([]);
    const [taxis, setTaxis] = useState([]);

    const [loading, setLoading] = useState(false);

    const editTripAtIndex = (index, newData) => {
        const updatedTrips = [...trips];
        updatedTrips[index] = { ...updatedTrips[index], ...newData };
        setTrips(updatedTrips);
    };

    const editPersonAtIndex = (index, newData) => {
        const updatedPeople = [...people];
        updatedPeople[index] = { ...updatedPeople[index], ...newData };
        setPeople(updatedPeople);
    };
    const deletePerson = (index) => {
        setPeople(prevPeople => prevPeople.filter((_, i) => i !== index));
    };
    const createPerson = () => {
        const newPersonList = [...people, {}]; // create a new array with an empty object added
        setPeople(newPersonList);
    };

    const deleteBoat = (index) => {
        setBoats(prevBoats => prevBoats.filter((_, i) => i !== index));
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
        document.querySelectorAll("input").forEach(inputEl => {
            inputEl.value = '';
        });
        document.querySelectorAll('[type="checkbox"]').forEach(checkboxEl => {
            checkboxEl.checked = false;
        });
    }

    useEffect(() => {
        axiosAuth.get(`${backendURL}/taxis`)
            .then((response) => response.data)
            .then(data => {
                setTaxis(data || []);
            })
            .catch(error => {
                console.error('Error fetching taxis:', error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare payload to send to the backend
        const payload = {
            arrivalDay: trips?.[0]?.day,
            departureDay: trips?.[1]?.day,
            arrivalSchedule: trips?.[0]?.timeFrame,
            departureSchedule: trips?.[1]?.timeFrame,
            arrivalTime: trips?.[0]?.timeFrame?.startsWith("Custom") ? trips?.[0]?.timeStart : undefined,
            departureTime: trips?.[1]?.timeFrame.startsWith("Custom") ? trips?.[1]?.timeStart : undefined,
            numberOfPeople: numberOfPeople,
            people: people.map(p => ({
                name: p.name,
                allergies: p.allergies || ""
            })),
            boats: boats.map(b => ({
                type: b.type,
                numberOf: Number(b.numberOf),
                rented: b.isRented
            }))
        };

        try {
            // Send the data to the backend for validation and creation
            const response = await axiosAuth.post(`${backendURL}/quick`, payload);
            // Handle success - inform the user and redirect
            alert("Reservation created successfully. Redirecting...");
            navigate('/quick/reservation');
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
                <input
                    className="quickPeopleInputText"
                    type="text"
                    id="reservationName"
                    value={people[0]?.name}
                    onChange={e => editPersonAtIndex(0, { name: e.target.value })}
                    required
                />

                <label>Number of People:</label>
                <input
                    className="quickPeopleInputNumber"
                    type="number"
                    id="numberOfPeople"
                    value={numberOfPeople}
                    onChange={e => setNumOfPeople(Number(e.target.value))}
                    min="1"
                    required
                />

                <div>
                    <button type="button" onClick={togglePersonDropdown}>
                        {peopleShown ? 'Hide People ▲' : 'Show People ▼'}
                    </button>
                    {peopleShown && (
                        <div className="dropdown-content" style={{ marginTop: '10px' }}>
                            {people.map((person, index) => (
                                <div key={index} className={`Person-Object`}>
                                    {index !== 0 && (
                                        <>
                                            {people.length > numberOfPeople && (
                                                <div className="error">
                                                    TOO MANY PEOPLE
                                                </div>
                                            )}
                                            <button type="button" className={((people.length > numberOfPeople) && "Delete") || "next"} onClick={() => {
                                                clearInputs();
                                                deletePerson(index);
                                            }}>Delete</button>
                                        </>
                                    )}
                                    <label>
                                        Name:
                                        <input
                                            type="text"
                                            value={person.name}
                                            onChange={(e) =>
                                                editPersonAtIndex(index, { name: e.target.value })
                                            }
                                        />
                                    </label>
                                    <label>
                                        Allergies:
                                        <input
                                            type="text"
                                            value={person.allergies}
                                            onChange={(e) =>
                                            editPersonAtIndex(index, { allergies: e.target.value })
                                            }
                                        />
                                        </label>
                                </div>
                            ))}
                            {numberOfPeople > people.length && (<button type="button" onClick={createPerson} className="next">+</button>)}

                        </div>
                    )}
                </div>

                <div>
                    <label>Number of Boats: {boats?.map((boat) => Number(boat.numberOf)).reduce((sum, current) => sum + current, 0)}</label>
                    <button type="button" onClick={toggleBoatDropdown}>
                        {boatsShown ? 'Hide Boats ▲' : 'Show Boats ▼'}
                    </button>
                    {boatsShown && (
                        <>
                            {boats?.map((boat, index) => (
                                <div
                                    key={boat.id || index}
                                    className={`Boat-Object`}
                                >
                                    <button
                                        type="button"
                                        className="next"
                                        onClick={() => {
                                            clearInputs();
                                            deleteBoat(index);
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <label>
                                        Type:
                                        <select
                                            value={boat.type || ""}
                                            onChange={(e) =>
                                                editBoatAtIndex(index, { type: e.target.value })
                                            }
                                            required
                                        >
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
                                        <input
                                            type="checkbox"
                                            className="inline"
                                            checked={boat.isRented}
                                            onChange={(e) =>
                                                editBoatAtIndex(index, { isRented: e.target.checked })
                                            }
                                        />
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
                        {tripsShown ? 'Hide Trips ▲' : 'Show Trips ▼'}
                    </button>

                    {tripsShown && (
                        <div className="dropdown-content" style={{ marginTop: '10px' }}>
                            {trips.map((trip, index) => {
                                return (
                                    <div key={index} className={`Trip-Object`}>
                                        <label>{index == 0 && "Arival" || "Departure"}:</label>
                                        <label>
                                            day:
                                            <input
                                                type="date"
                                                value={trip.day?.split('T')[0]}
                                                onChange={(e) => editTripAtIndex(index, { day: e.target.value })}
                                                required
                                            />
                                        </label>

                                        <label>Time Frame:
                                            <select
                                                className="editTripInputSelect"
                                                id="timeFrame"
                                                value={trip.timeFrame}
                                                onChange={e => editTripAtIndex(index, { timeFrame: e.target.value })}
                                                required
                                            >
                                                <option value="" disabled>-- select a timeframe --</option>
                                                <option value="Custom AM">Custom AM</option>
                                                <option value={index == 0 && "Secret to Lodge AM" || "Lodge to Secret AM"}>{index == 0 && "Secret to Lodge AM" || "Lodge to Secret AM"}</option>
                                                <option value="Custom">Custom</option>
                                                <option value={index == 0 && "Secret to Lodge PM" || "Lodge to Secret PM"}>{index == 0 && "Secret to Lodge PM" || "Lodge to Secret PM"}</option>
                                                <option value="Custom PM">Custom PM</option>
                                            </select>
                                        </label>

                                        {trip.timeFrame?.includes("Custom") && (<label>Time:
                                            <input
                                                className="editTripInputTime"
                                                type="time"
                                                id="timeStart"
                                                value={trip.timeStart}
                                                onChange={e => editTripAtIndex(index, { timeStart: e.target.value })}
                                                required
                                            />
                                        </label>)}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>


                <button type="submit" className={!loading && "next"} disabled={loading}>{loading ? "Loading..." : "Create New Reservation"}</button>
            </form>
        </div>
    );
}

export default QuickCreateReservation;