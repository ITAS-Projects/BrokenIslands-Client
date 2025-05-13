import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import "../../assets/EditBoat.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function EditBoat() {
    const { id } = useParams();
    const [rented, setRented] = useState(false);
    const [numberOf, setNumberOf] = useState(0);
    const [type, setType] = useState('Single Kayaks');
    const [sourceType, setSourceTypeHidden] = useState('None');
    const setSourceType = (value, setId = true) => {
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        Promise.all([
            axios.get(`${backendURL}/boats/${id}`)
            .then((response) => response.data)
            .then(data => {
                setRented(data.isRented);
                setNumberOf(data.numberOf);
                setType(data.type);

                let sourceIdGotten = null;
                if (data.GroupId == null) {
                    if (data.ReservationId === null) {
                        setSourceTypeHidden("None");
                    } else {
                        setSourceTypeHidden("Reservation");
                        sourceIdGotten = data.ReservationId;
                    }
                } else {
                    if (data.Group.seperatePeople) {
                        setSourceTypeHidden("People");
                    } else {
                        setSourceTypeHidden("Group");
                    }
                    sourceIdGotten = data.GroupId;
                }

                setSourceId(sourceIdGotten);


                return data.TaxiId;
            }),

            axios.get(`${backendURL}/taxis`)
            .then((response) => response.data)
            .then(data => {
                data.map(taxi => taxi.id);
                return data[0]?.id;
            })
          ])
          .then(([boatId, taxiBackupId]) => {
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            setLoading(false);
          });

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
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let reservationId = null;
        let groupId = null;
        if (sourceType === "Reservation") {
            reservationId = sourceId;
        } else if (sourceType !== "None") {
            groupId = sourceId;
        }

        axios.put(`${backendURL}/boats/${id}`, {
            isRented: rented,
            type: type,
            numberOf: numberOf,
            ReservationId: reservationId,
            GroupId: groupId,
        })
        .then(() => {
            alert('Boat edited successfully!');
            window.location.href = '/boats';
        })
        .catch(error => {
            console.error('Error editing boat:', error);
            alert('There was an error while editing the boat. Please try again.');
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

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

export default EditBoat;
