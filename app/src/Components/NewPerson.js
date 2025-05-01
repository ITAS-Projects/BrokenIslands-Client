import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewPerson = () => {

    const navigate = useNavigate();

    const [people, setPeople] = useState([]);
    const [newPerson, setNewPerson] = useState({
        name: '',
        email: ''
      });

      // Handle form field change for the new person
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPerson(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

    // Handle adding a new person
    const handleAddPerson = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8081/people', newPerson)
            .then(response => {
                alert("Person added successfully");

                const addedPerson = {
                    id: response.data.id,
                    ...newPerson, // name and email from form input
                };

                setPeople([...people, addedPerson]);
                navigate('/data');
            })
            .catch(error => console.error("Error adding person:", error));
    };

    return (
      <div>
        <button onClick={() => window.location.href = `/data`}>&lt; Back</button>
        <h1>New Person</h1>
        <form onSubmit={handleAddPerson}>
            <div>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={newPerson.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={newPerson.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Add Person</button>
        </form>
        </div>
    );



}

export default NewPerson;