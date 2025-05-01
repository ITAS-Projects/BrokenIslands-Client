import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PeopleList = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch people from the backend
  useEffect(() => {
    axios.get('http://localhost:8081/people')
      .then(response => {
        setPeople(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching people:', error);
        setLoading(false);
      });
  }, []);

  // Handle delete of a person
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/people/${id}`)
      .then(response => {
        alert("Person deleted successfully");
        setPeople(people.filter(person => person.id !== id)); // Update state to remove deleted person
      })
      .catch(error => console.error("Error deleting person:", error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>People List</h1>
      
      {/* Add Person Form */}
      <button onClick={() => window.location.href = `/data/new`}>Add New Person</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {people.map(person => (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td>{person.email}</td>
              <td>
                <button onClick={() => window.location.href = `/data/edit/${person.id}`}>Edit</button>
                <button onClick={() => handleDelete(person.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PeopleList;
