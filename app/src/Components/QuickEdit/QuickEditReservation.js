import React, { useEffect, useState } from "react";
import axiosAuth from "../authRequest";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/QuickEditReservation.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function QuickEditReservation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [reservation, setReservation] = useState(null);
    const [numberOfPeople, setNumOfPeople] = useState(0);
    const [notes, setNotes] = useState("");

    const [prevTrips, setPrevTrips] = useState(null);
    const [prevBoats, setPrevBoats] = useState(null);
    const [prevPeople, setPrevPeople] = useState(null);
    const [trips, setTrips] = useState(null);
    const [people, setPeople] = useState([]);
    const [boats, setBoats] = useState([]);
    const setupBoats = (value) => {
        setPrevBoats(value);
        setBoats(value);
    }
    const [taxis, setTaxis] = useState([]);

    const setupTrips = (newTrips) => {
        const arrivalTrips = [];
        const departureTrips = [];

        newTrips.forEach(trip => {
            trip.peopleOnTrip = trip.ReservationTrip?.peopleOnTrip || 1;
            trip.boatsOnTrip = trip.ReservationTrip?.boatsOnTrip || 0;
            const type = trip.ReservationTrip?.typeOfTrip;
            if (type === "Arrival") {
                arrivalTrips.push(trip);
            } else {
                departureTrips.push(trip);
            }
        });

        setPrevTrips({ arrival: arrivalTrips, departure: departureTrips });
        setTrips({ arrival: arrivalTrips, departure: departureTrips });
    }
    const editTripAtIndex = (type, index, newData) => {
        setTrips(prevTrips => {
            if (!prevTrips?.[type]) return prevTrips;

            const updatedTypeTrips = prevTrips[type].map((trip, i) =>
                i === index ? { ...trip, ...newData } : trip
            );

            return {
                ...prevTrips,
                [type]: updatedTypeTrips,
            };
        });
    };
    const deleteTrip = (type, index) => {
        setTrips(deletingTrips => {
            if (!deletingTrips?.[type]) return deletingTrips;

            return {
                ...deletingTrips,
                [type]: deletingTrips[type].map((trip, i) =>
                    i === index ? (index === 0 ? { new: true, timeFrame: "", TaxiId: "" } : undefined) : trip
                ).filter(_ => _ !== undefined),
            };
        });
    };
    const createTrip = (type, ref) => {
        setTrips(newTrips => {
            if (!newTrips?.[type]) return newTrips;

            return {
                ...newTrips,
                [type]: [
                    ...newTrips[type],
                    { day: ref.day, new: true, timeFrame: "", TaxiId: "", peopleOnTrip: 1, boatsOnTrip: 0 }
                ],
            };
        });
    };
    const resetTrip = (type, index) => {
        setTrips(resettingTrips => {
            if (!resettingTrips?.[type]) return resettingTrips;

            return {
                ...resettingTrips,
                [type]: resettingTrips[type].map((trip, i) =>
                    i === index ? prevTrips[type]?.[i] : trip
                ).filter(_ => _ !== undefined),
            };
        });
    };

    const setupPeople = (newPeople, leaderId) => {
        const index = newPeople.findIndex(person => person.id === leaderId);
        if (index > 0) {
            const [leader] = newPeople.splice(index, 1); // Remove the leader
            newPeople.unshift(leader); // Add to the beginning
        }
        setPrevPeople(newPeople);
        setPeople(newPeople);
    }
    const editPersonAtIndex = (index, newData) => {
        const updatedPeople = [...people];
        updatedPeople[index] = { ...updatedPeople[index], ...newData };
        setPeople(updatedPeople);
    };
    const deletePerson = (index) => {
        setPeople(prevPeople => prevPeople.filter((_, i) => i !== index));
    };
    const createPerson = () => {
        const newPersonList = [...people, { new: true }]; // create a new array with an empty object added
        setPeople(newPersonList);
    };
    const resetPerson = (index) => {
        setPeople(resettingPeople =>
            resettingPeople.map((person, i) => (i === index ? prevPeople[i] : person))
        );
    }
    const resetPeople = () => {
        setPeople(prevPeople);
    }

    const deleteBoat = (index) => {
        setBoats(prevBoats => prevBoats.filter((_, i) => i !== index));
    };
    const editBoatAtIndex = (index, newData) => {
        const updatedBoats = [...boats];
        updatedBoats[index] = { ...updatedBoats[index], ...newData };
        setBoats(updatedBoats);
    };
    const resetBoat = (index) => {
        setBoats(resettingBoats =>
            resettingBoats.map((boat, i) => (i === index ? prevBoats[i] : boat))
        );
    };
    const resetBoats = () => {
        setBoats(prevBoats);
    };
    const createBoat = () => {
        const newBoatList = [...boats, { new: true, numberOf: "1" }]; // create a new array with an empty object added
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
        axiosAuth.get(`${backendURL}/quick/${id}`)
            .then((response) => response.data)
            .then(data => {
                setReservation(data);
                setNumOfPeople(data.Group?.numberOfPeople || 0)
                setupPeople(data.Group?.People, data.Group?.leader?.id);
                setNotes(data.Group?.notes);
                setupBoats(data.Boats);
                setupTrips(data.Trips);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });

        axiosAuth.get(`${backendURL}/taxis`)
            .then((response) => response.data)
            .then(data => {
                setTaxis(data || []);
            })
            .catch(error => {
                console.error('Error fetching taxis:', error);
            });
    }, [id]);

    const timeOrder = [
        "Custom AM", "Lodge to Secret AM", "Secret to Lodge AM", "Custom", "Lodge to Secret PM", "Secret to Lodge PM", "Custom PM", "Paddle In", "Paddle Out"
    ]

    const staticTime = [
        "Lodge to Secret AM", "Secret to Lodge AM", "Lodge to Secret PM", "Secret to Lodge PM"
    ]

    const sortTrips = (tripList) => {
        return [...tripList].sort((a, b) => {
            if (!a.new) return -1;
            if (!b.new) return 1;

            const dayData = a.day?.split('T')[0].split('-');
            const dayData2 = b.day?.split('T')[0].split('-');

            if (!dayData?.[2]) return 1;
            if (!dayData2?.[2]) return -1;

            if (dayData[0] !== dayData2[0]) return dayData[0] - dayData2[0];
            if (dayData[1] !== dayData2[1]) return dayData[1] - dayData2[1];
            if (dayData[2] !== dayData2[2]) return dayData[2] - dayData2[2];

            return timeOrder.indexOf(a.timeFrame) - timeOrder.indexOf(b.timeFrame);
        });
    };

    const compareTimes = (t1, t2) => {
        const [h1, m1] = t1.split(':').slice(0, 2).map(Number);
        const [h2, m2] = t2.split(':').slice(0, 2).map(Number);

        if (h1 !== h2) return h1 - h2;
        return m1 - m2;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveLoading(true);

        const updatedData = {
            arrivalTrips: trips.arrival.map((at) => ({
                id: at.id,
                TaxiId: at.TaxiId || null,
                day: at.day,
                timeStart: at.timeStart,
                fromPlace: at.fromPlace,
                toPlace: at.toPlace,
                type: "arrival",
                timeFrame: at.timeFrame || "",
                peopleOnTrip: Number(at.peopleOnTrip) || 1,
                boatsOnTrip: Number(at.boatsOnTrip) || 0,
            })),
            departureTrips: trips.departure.map((dt) => ({
                id: dt.id,
                TaxiId: dt.TaxiId || null,
                day: dt.day,
                timeStart: dt.timeStart,
                fromPlace: dt.fromPlace,
                toPlace: dt.toPlace,
                type: "departure",
                timeFrame: dt.timeFrame || "",
                peopleOnTrip: Number(dt.peopleOnTrip) || 1,
                boatsOnTrip: Number(dt.boatsOnTrip) || 0,
            })),
            // trips: trips,
            numberOfPeople: Number(numberOfPeople) || 0,
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
            // Send the updated data to the backend to update the reservation
            const response = await axiosAuth.put(`${backendURL}/quick/${id}`, updatedData);
            alert("Reservation updated successfully, redirecting...");
            navigate('/quick/reservation');  // Redirect to reservations list or confirmation page
        } catch (error) {
            console.error("Error updating reservation:", error);
            alert(error.response?.data?.error || "There was an error while updating the reservation. Please try again.");
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Edit Reservation</h1>

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

                <label>Notes for trips:</label>
                <input
                    className="quickPeopleInputNumber"
                    type="text"
                    id="notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                />

                <div>
                    <button type="button" onClick={togglePersonDropdown}>
                        {peopleShown ? 'Hide People ▲' : 'Show People ▼'}
                    </button>
                    {people != prevPeople && (
                        <button
                            type="button"
                            className="next"
                            onClick={() => {
                                clearInputs();
                                resetPeople();
                            }}
                        >
                            Reset all People to previous names and allergies
                        </button>
                    )}
                    {peopleShown && (
                        <div className="dropdown-content" style={{ marginTop: '10px' }}>
                            {people.map((person, index) => (
                                <div key={index} className={`Person-Object ${person !== prevPeople[index]
                                    ? person.new
                                        ? "new"
                                        : "changed"
                                    : ""
                                    }`}>
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
                                    {person !== prevPeople[index] && !person.new && (
                                        <button
                                            type="button"
                                            className="next"
                                            onClick={() => {
                                                clearInputs();
                                                resetPerson(index);
                                            }}
                                        >
                                            Reset to previous name and allergies
                                        </button>
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
                    {boats != prevBoats && (
                        <button
                            type="button"
                            className="next"
                            onClick={() => {
                                clearInputs();
                                resetBoats();
                            }}
                        >
                            Reset all boats
                        </button>
                    )}
                    {boatsShown && (
                        <>
                            {boats?.map((boat, index) => (
                                <div
                                    key={boat.id || index}
                                    className={`Boat-Object ${boat !== prevBoats[index]
                                        ? boat.new
                                            ? "new"
                                            : "changed"
                                        : ""
                                        }`}
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
                                    {boat !== prevBoats[index] && !boat.new && (
                                        <button
                                            type="button"
                                            className="next"
                                            onClick={() => {
                                                clearInputs();
                                                resetBoat(index);
                                            }}
                                        >
                                            Reset to previous boat
                                        </button>
                                    )}
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
                            {Object.entries(trips)
                                .sort(([keyA], [keyB]) => {
                                    if (keyA.toLowerCase() === "arrival") return -1;
                                    if (keyB.toLowerCase() === "arrival") return 1;
                                    return 0;
                                })
                                .map(([keyTripType, tripList]) => {
                                    const sorted = sortTrips(tripList);
                                    return <>
                                        <p>{keyTripType[0].toUpperCase()}{keyTripType.slice(1).toLowerCase()}:</p>
                                        {sorted?.map((trip, index) => {
                                            let numberOfBoats = boats?.reduce((sum, boat) => {
                                                if (boat.isRented) {
                                                    return sum;
                                                } else {
                                                    return sum + Number(boat.numberOf);
                                                }
                                            }, 0);
                                            const peopleOnTrip = taxis.find(taxifind => taxifind.id === prevTrips?.[keyTripType]?.[index]?.TaxiId)?.Trips?.find(taxiTrip => taxiTrip.id === trip.id)?.Reservations?.map(res => res?.Group?.numberOfPeople).reduce((sum, current) => sum + current, 0);;
                                            const boatsOnTrip = taxis.find(taxifind => taxifind.id === prevTrips?.[keyTripType]?.[index]?.TaxiId)?.Trips?.find(taxiTrip => taxiTrip.id === trip.id)?.Reservations?.map(res => {
                                                return res.Boats?.map((boat) => Number(boat.numberOf)).reduce((sum, current) => sum + current, 0)
                                            }).reduce((sum, current) => sum + current, 0);
                                            return (
                                                <div key={index} className={`Trip-Object ${trip !== prevTrips?.[keyTripType]?.[index] ? (trip.new ? "new" : "changed") : ""}`}>
                                                    <label>{trip !== prevTrips?.[keyTripType]?.[index] && (trip.new ? "(new)" : "(changed)")}</label>

                                                    {trip !== prevTrips?.[keyTripType]?.[index] ? (
                                                        <button type="button" className="next" onClick={() => {
                                                            clearInputs();
                                                            resetTrip(keyTripType, index);
                                                        }}>Reset to previous trip</button>) : (
                                                        index === 0 ? (
                                                            <button type="button" className="next" onClick={() => {
                                                                clearInputs();
                                                                deleteTrip(keyTripType, index);
                                                            }}>Move to new trip</button>
                                                        ) : (
                                                            <button type="button" className="next" onClick={() => {
                                                                clearInputs();
                                                                deleteTrip(keyTripType, index);
                                                            }}>Remove Additional Trip</button>
                                                        )
                                                    )}

                                                    <label>
                                                        day:
                                                        <input
                                                            type="date"
                                                            value={trip.day?.split('T')[0]}
                                                            onChange={(e) => editTripAtIndex(keyTripType, index, { day: e.target.value })}
                                                            required
                                                        />
                                                    </label>

                                                    <label>Time Frame:
                                                        <select
                                                            className="editTripInputSelect"
                                                            id="timeFrame"
                                                            value={trip.timeFrame}
                                                            onChange={e => editTripAtIndex(keyTripType, index, { timeFrame: e.target.value })}
                                                            required
                                                        >
                                                            <option value="" disabled>-- select a timeframe --</option>
                                                            <option value="Custom AM">Custom AM</option>
                                                            <option value={(keyTripType == "arrival" && "Secret to Lodge AM") || "Lodge to Secret AM"}>{(keyTripType == "arrival" && "Secret to Lodge AM") || "Lodge to Secret AM"}</option>
                                                            <option value="Custom">Custom</option>
                                                            <option value={(keyTripType == "arrival" && "Secret to Lodge PM") || "Lodge to Secret PM"}>{(keyTripType == "arrival" && "Secret to Lodge PM") || "Lodge to Secret PM"}</option>
                                                            <option value="Custom PM">Custom PM</option>
                                                            <option value={(keyTripType == "arrival" && "Paddle In") || "Paddle Out"}>{(keyTripType == "arrival" && "Paddle In") || "Paddle Out"}</option>
                                                        </select>
                                                    </label>

                                                    {(trip.timeFrame?.includes("Custom") || trip.timeFrame?.includes("Paddle")) && (
                                                        <label>Time:
                                                            <input
                                                                className="editTripInputTime"
                                                                type="time"
                                                                id="timeStart"
                                                                value={trip.timeStart}
                                                                onChange={e => editTripAtIndex(keyTripType, index, { timeStart: e.target.value })}
                                                                required
                                                            />
                                                        </label>
                                                    )}

                                                    {trip.timeFrame?.includes("Custom") && index === 0 && (
                                                        <>
                                                            <label>From Place:
                                                                <input
                                                                    className="editTripInputText"
                                                                    type="text"
                                                                    id="fromPlace"
                                                                    value={trip.fromPlace}
                                                                    onChange={e => editTripAtIndex(keyTripType, index, { fromPlace: e.target.value })}
                                                                    required
                                                                />
                                                            </label>

                                                            <label>To Place:
                                                                <input
                                                                    className="editTripInputText"
                                                                    type="text"
                                                                    id="toPlace"
                                                                    value={trip.toPlace}
                                                                    onChange={e => editTripAtIndex(keyTripType, index, { toPlace: e.target.value })}
                                                                    required
                                                                />
                                                            </label>
                                                        </>
                                                    )}

                                                    {!trip.timeFrame?.includes("Paddle") && (
                                                        <><label>Taxi:
                                                            <select
                                                                className={`editTripInputSelect ${taxis.find(taxifind => taxifind.id === trip.TaxiId)?.spaceForPeople < (trips?.[keyTripType]?.length > 1 ? trip.peopleOnTrip : peopleOnTrip) ? "error" : ""}`}
                                                                id="taxi"
                                                                value={trip.TaxiId || ""}
                                                                onChange={e => editTripAtIndex(keyTripType, index, { TaxiId: Number(e.target.value) })}
                                                                required
                                                            >
                                                                <option value="" disabled>-- select a taxi --</option>

                                                                {taxis?.map((taxi, index) => {
                                                                    return (
                                                                        <option key={index} className={taxi.spaceForPeople < (trips?.[keyTripType]?.length > 1 ? trip.peopleOnTrip : peopleOnTrip) ? "error" : "not-error"} disabled={!taxi.running} value={taxi.id}>people: {(trips?.[keyTripType]?.length > 1 ? trip.peopleOnTrip : peopleOnTrip)}/{taxi.spaceForPeople}, boats: {(trips?.[keyTripType]?.length > 1 ? trip.boatsOnTrip : numberOfBoats)}/{taxi.spaceForKayaks}</option>
                                                                    )
                                                                })}
                                                            </select>
                                                        </label>

                                                            <button type="button" className="next" onClick={() => {
                                                                clearInputs();
                                                                createTrip(keyTripType, trip);
                                                            }}>Create another trip</button>

                                                        </>
                                                    )}

                                                    {trips?.[keyTripType]?.length > 1 && (
                                                        <>
                                                            <label>Number of people on trip:
                                                                <input
                                                                    type="number"
                                                                    className="inline"
                                                                    value={trip.peopleOnTrip || 0}
                                                                    onChange={(e) =>
                                                                        editTripAtIndex(keyTripType, index, { peopleOnTrip: Number(e.target.value) })
                                                                    }
                                                                    min={trip.boatsOnTrip > 0 ? "0" : "1"}
                                                                    max={Math.max(0, numberOfPeople + (trip.peopleOnTrip || 0) - trips?.[keyTripType]?.reduce((sum, trip) => sum + Math.max(0, trip.peopleOnTrip || 0), 0))}
                                                                    required
                                                                />
                                                            </label>

                                                            <label>Number of boats on trip:
                                                                <input
                                                                    type="number"
                                                                    className="inline"
                                                                    value={trip.boatsOnTrip || 0}
                                                                    onChange={(e) =>
                                                                        editTripAtIndex(keyTripType, index, { boatsOnTrip: Number(e.target.value) })
                                                                    }
                                                                    min={trip.peopleOnTrip > 0 ? "0" : "1"}
                                                                    max={Math.max(0, numberOfBoats + (trip.boatsOnTrip || 0) - trips?.[keyTripType]?.reduce((sum, trip) => sum + Math.max(0, trip.boatsOnTrip || 0), 0))}
                                                                    required
                                                                />
                                                            </label>
                                                        </>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </>;
                                })}
                        </div>
                    )}
                </div>


                <button type="submit" className={!saveLoading && "next" || ""} disabled={saveLoading}>{saveLoading ? "Loading..." : "Save Changes"}</button>
            </form>
        </div>
    );
}

export default QuickEditReservation;