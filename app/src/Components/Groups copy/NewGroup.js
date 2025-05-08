import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../../assets/NewGroup.css";

function NewGroup() {
    const [numberOfPeople, setNumberOfPeople] = useState(0);
    const [isUnrelatedGroup, setIsUnrelatedGroup] = useState(false);
    const [selectedTrips, setSelectedTrips] = useState([]);
    const [leader, setLeader] = useState();
    const [selectedPeople, setSelectedPeopleHidden] = useState([]);
    const setSelectedPeople = (values) => {
        setSelectedPeopleHidden(values);
    
        let addedLeader = (!isUnrelatedGroup && !values.includes(leader) && leader)
            ? [...values, leader]
            : values;
    
        setSelectedWithLeader(addedLeader);
    }
    
    const [selectedWithLeader, setSelectedWithLeader] = useState([]);
    
    const [trips, setTrips] = useState([]);
    const [people, setPeople] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/trips')
            .then((response) => {
                setTrips(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        axios.get('http://localhost:8081/people')
            .then((response) => {
                setPeople(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        let addedLeader = (!isUnrelatedGroup && !selectedPeople.includes(leader))
            ? [...selectedPeople, leader]
            : selectedPeople;
        setSelectedWithLeader(addedLeader);

        if (Array.isArray(selectedTrips) && isUnrelatedGroup) {
            setSelectedTrips(Number(selectedTrips[0]));
        } else if (!Array.isArray(selectedTrips) && !isUnrelatedGroup) {
            setSelectedTrips([`${selectedTrips}`]);
        }
        console.log(selectedTrips);
    }, [isUnrelatedGroup, leader, selectedPeople]);
    
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8081/groups', {
            numberOfPeople: numberOfPeople,
            seperatePeople: isUnrelatedGroup,

        })
        .then(() => {
            alert('Group added successfully!');
            window.location.href = '/groups';
        })
        .catch(error => {
            console.error('Error adding group:', error);
            alert('There was an error while adding the group. Please try again.');
        });
    };

    return (
        <div>
            <h1>New Group</h1>
            <form className="newGroupForm" onSubmit={handleSubmit}>
                <div className="newGroupFormField">
                    <label className="newGroupLabel" htmlFor="numberOfPeople">Number of People:</label>
                    <input
                        className="newGroupInputNumber"
                        type="number"
                        id="numberOfPeople"
                        value={numberOfPeople}
                        onChange={e => setNumberOfPeople(e.target.value)}
                        min="1"
                        required
                    />
                </div>
                <br />
                <div className="newGroupFormField">
                    <label className="newGroupLabel" htmlFor="isUnrelatedGroup">Unrelated People:</label>
                    <input
                        className="newGroupInputCheckbox"
                        type="checkbox"
                        id="isUnrelatedGroup"
                        checked={isUnrelatedGroup}
                        onChange={e => setIsUnrelatedGroup(e.target.checked)}
                    />
                </div>
                <br />
                {!isUnrelatedGroup && (<>
                <div className="newGroupFormField">
                    <label className="newBoatLabel" htmlFor="leader">Leader:</label>
                    <select
                        className="newTripInputSelect"
                        id="leader"
                        value={leader}
                        onChange={e => setLeader(e.target.value)}
                    >
                        {people?.map(person => (
                            <option key={person.id} value={person.id}>{person.name}</option>
                        ))}
                    </select>
                </div>
                <br />
                </>)}
                <div className="newGroupFormField">
                    <label className="newBoatLabel" htmlFor="selectedTrips">Trips:</label>
                    <select
                        className="newTripInputSelect"
                        id="selectedTrips"
                        value={selectedTrips}
                        onChange={e => {
                            let selectedOptions;
                            if (isUnrelatedGroup) {
                                selectedOptions = e.target.value;
                            } else {
                                selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                            }

                            setSelectedTrips(selectedOptions);
                        }}
                        multiple={!isUnrelatedGroup && "multiple"}
                    >
                        {trips?.map(trip => (
                            <option key={trip.id} value={trip.id}>{trip.day?.split('T')[0]} - {trip.timeFrame}</option>
                        ))}
                    </select>
                </div>
                <br />
                <div className="newGroupFormField">
                    <label className="newBoatLabel" htmlFor="selectedPeople">People:</label>
                    <select
                        className="newTripInputSelect"
                        id="selectedPeople"
                        value={selectedWithLeader}
                        onChange={e => {
                            const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                            setSelectedPeople(selectedOptions);
                        }}
                        multiple
                    >
                        {people?.map(person => (
                            <option key={person.id} value={person.id}>{person.name}</option>
                        ))}
                    </select>
                </div>
                <br />
                <br /><br />
                <button className="newGroupButton" type="submit">Add Group</button>
            </form>
        </div>
    );
}

export default NewGroup;
