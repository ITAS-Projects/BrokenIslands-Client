import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../../assets/NewBoat.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function NewBoat() {
    const [rented, setRented] = useState(false);
    const [numberOf, setNumberOf] = useState(0);
    const [type, setType] = useState('Single Kayaks');
    const [sourceType, setSourceTypeHidden] = useState('None');
    const setSourceType = (value) => {
        if (value === "Group") {
            setSourceId(groups?.[0]?.id);
        } else if (value === "Reservation") {
            setSourceId(reservations?.[0]?.id);
        } else if (value === "People") {
            setSourceId(people?.[0]?.id);
        } else if (value === "None") {
        } else {
            return false;
        }
        return setSourceTypeHidden(value);
    }
    const [sourceId, setSourceId] = useState();

    const [groups, setGroups] = useState();
    const [reservations, setReservations] = useState();
    const [people, setPeople] = useState();

    useEffect(() => {
        axios.get(`${backendURL}/groups`)
            .then((response) => {
                let tempGroups = response.data;
                let groupResult = tempGroups.filter(group => {
                    return group.seperatePeople === false;
                })
                let peopleResult = tempGroups.filter(group => {
                    return group.seperatePeople === true;
                })
                setGroups(groupResult);
                setPeople(peopleResult);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        axios.get(`${backendURL}/reservations`)
            .then((response) => {
                setReservations(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    
    const handleSubmit = (e) => {
        e.preventDefault();

        let reservationId = null;
        let groupId = null;
        if (sourceType === "Reservation") {
            reservationId = sourceId;
        } else if (sourceType !== "None") {
            groupId = sourceId;
        }

        axios.post(`${backendURL}/boats`, {
            isRented: rented,
            type: type,
            numberOf: numberOf,
            ReservationId: reservationId,
            GroupId: groupId,
        })
        .then(() => {
            alert('Boat added successfully!');
            window.location.href = '/boats';
        })
        .catch(error => {
            console.error('Error adding boat:', error);
            alert('There was an error while adding the boat. Please try again.');
        });
    };

    return (
        <div>
            <h1>New Boat</h1>
            <form className="newBoatForm" onSubmit={handleSubmit}>
                <div className="newBoatFormField">
                    <label className="newBoatLabel" htmlFor="rented">Rented Boats:</label>
                    <input
                        className="newBoatInputCheckbox"
                        type="checkbox"
                        id="rented"
                        checked={rented}
                        onChange={e => setRented(e.target.checked)}
                    />
                </div>
                <br />
                <div className="newBoatFormField">
                    <label className="newBoatLabel" htmlFor="numberOf">Amount of Boats:</label>
                    <input
                        className="newBoatInputNumber"
                        type="number"
                        id="numberOf"
                        value={numberOf}
                        onChange={e => setNumberOf(Number(e.target.value))}
                        min="1"
                        required
                    />
                </div>
                <br />
                <div className="newBoatFormField">
                    <label className="newBoatLabel" htmlFor="type">Type of Boats:</label>
                    <select
                        className="newTripInputSelect"
                        id="type"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        <option>Single Kayaks</option>
                        <option>XL Single Kayaks</option>
                        <option>Double Kayaks</option>
                        <option>XL Double Kayaks</option>
                        <option>Canoes</option>
                    </select>
                </div>
                <br />
                <div className="newBoatFormField">
                    <label className="newBoatLabel" htmlFor="sourceType">Source:</label>
                    <select
                        className="newTripInputSelect"
                        id="sourceType"
                        value={sourceType}
                        onChange={e => setSourceType(e.target.value)}
                    >
                        <option selected>None</option>
                        <option>Group</option>
                        <option>Reservation</option>
                        <option>People</option>
                    </select>
                </div>
                <br />
                <div className="newBoatFormField">
                {((sourceType === "Reservation" && (
                    <>
                    <label className="newBoatLabel" htmlFor="sourceId">Reservation:</label>
                    <select
                        className="newTripInputSelect"
                        id="sourceId"
                        value={sourceId}
                        onChange={e => setSourceId(e.target.value)}
                    >
                        {reservations?.map(reservation => (
                            <option key={reservation.id} value={reservation.id}>Leader:{reservation.Group.leader?.name}</option>
                        ))}
                    </select>
                    </>
                )) || (sourceType === "Group" && (
                    <>
                    <label className="newBoatLabel" htmlFor="sourceId">Group:</label>
                    <select
                        className="newTripInputSelect"
                        id="sourceId"
                        value={sourceId}
                        onChange={e => setSourceId(e.target.value)}
                    >
                        {groups?.map(group => (
                            <option key={group.id} value={group.id}>Leader:{group.leader?.name}</option>
                        ))}
                    </select>
                    </>
                ))) || (sourceType === "People" &&(
                    <>
                    <label className="newBoatLabel" htmlFor="sourceId">People:</label>
                    <select
                        className="newTripInputSelect"
                        id="sourceId"
                        value={sourceId}
                        onChange={e => setSourceId(e.target.value)}
                    >
                        {people?.map(peopleGroup => (
                            <option key={peopleGroup.id} value={peopleGroup.id}>Amount Of People:{peopleGroup.numberOfPeople}</option>
                        ))}
                    </select>
                    </>
                ))}
                </div>
                <br />
                <br /><br />
                <button className="newBoatButton" type="submit">Add Boat</button>
            </form>
        </div>
    );
}

export default NewBoat;
