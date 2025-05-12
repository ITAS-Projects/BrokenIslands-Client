import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../assets/QuickEditReservation.css";

function QuickEditReservation() { 
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [reservation, setReservation] = useState(null);
    const [numberOfPeople, setNumOfPeople] = useState(0);
    
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
        const timeOrder = [
            "Custom AM", "Lodge to Secret AM", "Secret to Lodge AM", "Custom", "Lodge to Secret PM", "Secret to Lodge PM", "Custom PM"
        ]

        newTrips?.sort((a, b) => {
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
        });
        setPrevTrips(newTrips);
        setTrips(newTrips);
    }
    const editTripAtIndex = (index, newData) => {
        const updatedTrips = [...trips];
        updatedTrips[index] = { ...updatedTrips[index], ...newData };
        setTrips(updatedTrips);
    };
    const deleteTrip = (index) => {
        setTrips(deletingTrips =>
            deletingTrips.map((trip, i) => (i === index ? {new: true, timeFrame: "", TaxiId: ""} : trip))
        );
    };
    const resetTrip = (index) => {
        setTrips(resettingTrips =>
            resettingTrips.map((trip, i) => (i === index ? prevTrips[i] : trip))
        );
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
        const newPersonList = [...people, {new: true}]; // create a new array with an empty object added
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
        const newBoatList = [...boats, {new: true, numberOf: "1"}]; // create a new array with an empty object added
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
        axios.get(`http://localhost:8081/reservations/${id}`)
            .then((response) => response.data)
            .then(data => {
                setReservation(data);
                setNumOfPeople(data.Group?.numberOfPeople || 0)
                setupPeople(data.Group?.People, data.Group?.leader?.id);
                setupBoats(data.Boats);
                setupTrips(data.Trips);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });

        axios.get("http://localhost:8081/taxis")
            .then((response) => response.data)
            .then(data => {
                setTaxis(data || []);
            })
            .catch(error => {
                console.error('Error fetching taxis:', error);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:8081/reservations/${id}`, {
        })
        .then(() => {
            alert('Reservation edited successfully!');
            window.location.href = '/quick/reservation';
        })
        .catch(error => {
            console.error('Error editing reservation:', error);
            alert('There was an error while editing the reservation. Please try again.');
        });
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
                        value={people[0].name}
                        onChange={e => editPersonAtIndex(0, {name: e.target.value})}
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
                    {people != prevPeople && (
                    <button
                        type="button"
                        className="next"
                        onClick={() => {
                        clearInputs();
                        resetPeople();
                        }}
                    >
                        Reset all People to previous names
                    </button>
                    )}
                    {peopleShown && (
                        <div className="dropdown-content" style={{ marginTop: '10px' }}>
                            {people.map((person, index) => (
                                    <div key={index} className={`Person-Object ${
                                    person !== prevPeople[index]
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
                                            Reset to previous boat
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
                                        {/* <label>
                                        Allergies:
                                        <input
                                            type="text"
                                            value={person.allergies}
                                            onChange={(e) =>
                                            editPersonAtIndex(index, { allergies: e.target.value })
                                            }
                                        />
                                        </label> */}
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
                            className={`Boat-Object ${
                            boat !== prevBoats[index]
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
                            {trips.map((trip, index) => {
                                let peopleOnTrip = taxis.find(taxifind => taxifind.id === prevTrips[index].TaxiId).Trips?.find(taxiTrip => taxiTrip.id === trip.id)?.Reservations?.map(res => res?.Group?.numberOfPeople).reduce((sum, current) => sum + current, 0);;
                                const boatsOnTrip = taxis.find(taxifind => taxifind.id === prevTrips[index].TaxiId).Trips?.find(taxiTrip => taxiTrip.id === trip.id)?.Reservations?.map(res => {
                                    return res.Boats?.map((boat) => Number(boat.numberOf)).reduce((sum, current) => sum + current, 0)
                                }).reduce((sum, current) => sum + current, 0);
                                return (
                                    <div key={index} className={`Trip-Object ${trip !== prevTrips[index] ? (trip.new ? "new" : "changed") : ""}`}>
                                        <label>{index == 0 && "Arival" || "Departure"} {trip !== prevTrips[index] ? (trip.new ? "(new)" : "(changed)") : ""}:</label>
                                        {trip !== prevTrips[index] ? (
                                        <button type="button" className="next" onClick={() => {
                                            clearInputs();
                                            resetTrip(index);
                                        }}>Reset to previous trip</button>) : (
                                        <button type="button" className="next" onClick={() => {
                                            clearInputs();
                                            deleteTrip(index);
                                        }}>Move to new trip</button>
                                        )}
                                        <label>
                                        day:
                                        <input
                                            type="date"
                                            value={trip.day?.split('T')[0]}
                                            onChange={(e) => editTripAtIndex(index, {day: e.target.value})}
                                            required
                                        />
                                        </label>

                                        <label>Time Frame:
                                        <select
                                            className="editTripInputSelect"
                                            id="timeFrame"
                                            value={trip.timeFrame}
                                            onChange={e => editTripAtIndex(index, {timeFrame: e.target.value})}
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

                                        {trip.timeFrame?.includes("Custom") &&(<label>Time:
                                        <input
                                            className="editTripInputTime"
                                            type="time"
                                            id="timeStart"
                                            value={trip.timeStart}
                                            onChange={e => editTripAtIndex(index, {timeStart: e.target.value})}
                                            required
                                        />
                                        </label>)}

                                        <label>Taxi:
                                        <select
                                            className={`editTripInputSelect ${taxis.find(taxifind => taxifind.id === trip.TaxiId)?.spaceForPeople <= peopleOnTrip ? "error" : ""}`}
                                            id="taxi"
                                            value={trip.TaxiId}
                                            onChange={e => editTripAtIndex(index, {TaxiId: Number(e.target.value)})}
                                            required
                                        >
                                            <option value="" disabled selected>-- select a taxi --</option>

                                            {taxis?.map(taxi => {
                                                return (
                                                    <option className={taxi.spaceForPeople <= peopleOnTrip ? "error" : "not-error"} disabled={!taxi.running} value={taxi.id}>people: {peopleOnTrip}/{taxi.spaceForPeople}, boats: {boatsOnTrip}/{taxi.spaceForKayaks}</option>
                                                )
                                            })}
                                        </select>
                                        </label>
                                    </div>
                                    )})}
                        </div>
                    )}
                </div>


                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default QuickEditReservation;