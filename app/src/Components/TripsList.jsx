import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TripsList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch people and trips at the same time
    axios.get('http://localhost:8081/trips')
    .then(tripsResponse => {
      setTrips(tripsResponse.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/trips/${id}`)
      .then(response => {
        alert(`${response.data.message} successfully`);
        setTrips(trips.filter(trip => trip.id !== id)); // Update state to remove deleted person
      })
      .catch(error => console.error("Error deleting trip:", error));
  };

  const getPeople = (data) => {
    return [`${data.People.length}/${data.numberOfPeople}`, data.People.map(person => person.name).join(', ')].join(': ');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Trips List</h1>
      <button onClick={() => window.location.href = `/trips/new`}>Add New trip</button>
      <table>
        <thead>
          <tr>
            <th>Time Start</th>
            <th>Time End</th>
            <th>Day</th>
            <th>From Place</th>
            <th>To Place</th>
            <th>People</th>
            <th>Schedule</th>
            <th>Taxi</th>
          </tr>
        </thead>
        <tbody>
          {trips.map(trip => (
            <tr key={trip.id}>
              <td>{trip.timeStart}</td>
              <td>{trip.timeEnd}</td>
              <td>{trip.day.split('T')[0]}</td>
              <td>{trip.fromPlace}</td>
              <td>{trip.toPlace}</td>
              <td>{getPeople(trip)}</td>
              <td>{trip.Schedule}</td>
              <td>{trip.Taxi.id}: {trip.numberOfBoats}/{trip.Taxi.spaceForKayaks}</td>
              <td>
                <button onClick={() => window.location.href = `/trips/edit/${trip.id}`}>Edit</button>
                <button onClick={() => handleDelete(trip.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TripsList;
