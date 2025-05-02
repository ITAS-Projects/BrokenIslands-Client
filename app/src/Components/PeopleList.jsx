import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PeopleList = () => {
  const [people, setPeople] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch people and schedules at the same time
    Promise.all([
      axios.get('http://localhost:8081/people'),
      axios.get('http://localhost:8081/schedules')
    ])
    .then(([peopleResponse, schedulesResponse]) => {
      setPeople(peopleResponse.data);
      setSchedules(schedulesResponse.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/people/${id}`)
      .then(response => {
        alert("Person deleted successfully");
        setPeople(people.filter(person => person.id !== id)); // Update state to remove deleted person
      })
      .catch(error => console.error("Error deleting person:", error));
  };

  const getSchedules = (data) => {
    return data.map(schedule => {
      return schedule.costOverride;
    }).join(', ');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>People List</h1>
      <button onClick={() => window.location.href = `/users/new`}>Add New Person</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Schedules</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {people.map(person => (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td>{getSchedules(person.Schedules)}</td>
              <td>
                <button onClick={() => window.location.href = `/users/edit/${person.id}`}>Edit</button>
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
