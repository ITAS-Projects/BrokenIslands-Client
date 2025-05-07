import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import "../../assets/EditPerson.css";

function EditPerson() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [allergies, setAllergies] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8081/people/${id}`)
            .then((response) => response.data)
            .then(data => {
                setName(data.name);
                setAllergies(data.allergies);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:8081/people/${id}`, {
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
  
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>New Person</h1>
            <form className="editPersonForm" onSubmit={handleSubmit}>
                <div className="editPersonFormField">
                    <label className="editPersonLabel" htmlFor="name">Name:</label>
                    <input
                        className="editPersonInputText"
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div className="editPersonFormField">
                    <label className="editPersonLabel" htmlFor="allergies">Allergies:</label>
                    <input
                        className="editPersonInputText"
                        type="text"
                        id="allergies"
                        value={allergies}
                        onChange={e => setAllergies(e.target.value)}
                    />
                </div>
                <br /><br />
                <button className="editPersonButton" type="submit">Add Person</button>
            </form>
        </div>
    );
}

export default EditPerson;
