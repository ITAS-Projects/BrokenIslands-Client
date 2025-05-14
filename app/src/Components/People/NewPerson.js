import React, { useState } from "react";
import axiosAuth from "../authRequest";
import "../../assets/NewPerson.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function NewPerson() {
    const [name, setName] = useState('');
    const [allergies, setAllergies] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        axiosAuth.post(`${backendURL}/people`, {
            name: name,
            allergies: allergies
        })
        .then(() => {
            alert('Person added successfully!');
            window.location.href = '/people';
        })
        .catch(error => {
            console.error('Error adding person:', error);
            alert('There was an error while adding the person. Please try again.');
        });
    };

    return (
        <div>
            <h1>New Person</h1>
            <form className="newPersonForm" onSubmit={handleSubmit}>
                <div className="newPersonFormField">
                    <label className="newPersonLabel" htmlFor="name">Name:</label>
                    <input
                        className="newPersonInputText"
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div className="newPersonFormField">
                    <label className="newPersonLabel" htmlFor="allergies">Allergies:</label>
                    <input
                        className="newPersonInputText"
                        type="text"
                        id="allergies"
                        value={allergies}
                        onChange={e => setAllergies(e.target.value)}
                    />
                </div>
                <br /><br />
                <button className="newPersonButton" type="submit">Add Person</button>
            </form>
        </div>
    );
}

export default NewPerson;
