import React, { useEffect, useState } from "react";
import axiosAuth from "../authRequest";
import "../../assets/PersonList.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function PersonList() {
    const [people, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        axiosAuth.get(`${backendURL}/people`)
            .then((response) => {
                setPersons(response.data)
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);
  
    const handleDelete = (id) => {
      axiosAuth.delete(`${backendURL}/people/${id}`)
        .then(response => {
          alert("Person deleted successfully");
          setPersons(people.filter(person => person.id !== id)); // Update state to remove deleted person
        })
        .catch(error => console.error("Error deleting person:", error));
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h1>Person List</h1>
        <button onClick={() => window.location.href = `/people/new`}>Add New Person</button>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Allergies</th>
              <th>Management</th>
            </tr>
          </thead>
          <tbody>
            {people.map(person => (
              <tr key={person.id}>
                <td>{person.id}</td>
                <td>{person.name}</td>
                <td>{person.allergies || "None"}</td>
                <td>
                  <button onClick={() => window.location.href = `/people/edit/${person.id}`}>Edit</button>
                  <button onClick={() => handleDelete(person.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default PersonList;