import React, { useState } from "react";
import axios from 'axios';
import "../../assets/NewTaxi.css";

function NewTaxi() {
    const [spaceForKayaks, setSpaceForKayaks] = useState(0);
    const [spaceForPeople, setSpaceForPeople] = useState(0);
    const [running, setRunning] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (spaceForKayaks <= 0) {
            alert("Please provide a valid number of spaces for kayaks (greater than 0).");
            return;
        }

        if (spaceForPeople <= 0) {
            alert("Please provide a valid number of spaces for people (greater than 0).");
            return;
        }

        axios.post('http://localhost:8081/taxis', {
            spaceForKayaks: spaceForKayaks,
            spaceForPeople: spaceForPeople,
            running: running
        })
        .then(() => {
            alert('Taxi added successfully!');
            window.location.href = '/taxis';
        })
        .catch(error => {
            console.error('Error adding taxi:', error);
            alert('There was an error while adding the taxi. Please try again.');
        });
    };

    return (
        <div>
            <h1>New Taxi</h1>
            <form className="newTaxiForm" onSubmit={handleSubmit}>
                <div className="newTaxiFormField">
                    <label className="newTaxiLabel" htmlFor="spaceForKayaks">Space For Kayaks:</label>
                    <input
                        className="newTaxiInputNumber"
                        type="number"
                        id="spaceForKayaks"
                        value={spaceForKayaks}
                        onChange={e => setSpaceForKayaks(Number(e.target.value))}
                        min="1"
                        required
                    />
                </div>
                <br />
                <div className="newTaxiFormField">
                    <label className="newTaxiLabel" htmlFor="spaceForPeople">Space For People:</label>
                    <input
                        className="newTaxiInputNumber"
                        type="number"
                        id="spaceForPeople"
                        value={spaceForPeople}
                        onChange={e => setSpaceForPeople(Number(e.target.value))}
                        min="1"
                        required
                    />
                </div>
                <br />
                <div className="newTaxiFormField">
                    <label className="newTaxiLabel" htmlFor="running">Running:</label>
                    <input
                        className="newTaxiCheckbox"
                        type="checkbox"
                        id="running"
                        checked={running}
                        onChange={e => setRunning(e.target.checked)}
                    />
                </div>
                <br /><br />
                <button className="newTaxiButton" type="submit">Add Taxi</button>
            </form>
        </div>
    );
}

export default NewTaxi;
