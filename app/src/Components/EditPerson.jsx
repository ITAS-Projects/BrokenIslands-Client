import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditPerson = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [allergies, setAllergies] = useState('');
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    // Fetch people and schedules at the same time
      axios.get(`http://localhost:8081/people/${id}`)
        .then(response => response.data)
        .then(data => {
          setName(data.name);
          setAllergies(data.allergies);
          setSelectedSchedules(data.Schedules.map(schedule => schedule.id));
        })
        .catch(error => console.error(`Error fetching person ${id}:`, error))

      axios.get('http://localhost:8081/schedules')
        .then(response => setSchedules(response.data))
        .catch(error => console.error('Error fetching schedules:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8081/people/${id}`, {
      name: name,
      allergies: allergies,
      scheduleIds: selectedSchedules
    })
    .then(() => {
      alert('Person updated successfully!');
      window.location.href = '/';
    })
    .catch(error => console.error('Error updating person:', error));
  };

  return (
    <div>
      <h2>Edit Person</h2>
      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <label>Allergies: </label>
        <input value={allergies} onChange={e => setAllergies(e.target.value)} />
        <br /><br />
        <label>Select Schedules:</label>
        <select multiple value={selectedSchedules} onChange={e => {
          const options = Array.from(e.target.selectedOptions, option => option.value);
          setSelectedSchedules(options);
        }}>
          {schedules.map(s => (
            <option key={s.id} value={s.id}>{s.timeStart}</option>
          ))}
        </select>
        <br /><br />
        <button type="submit">Save Person</button>
      </form>
    </div>
  );
};

export default EditPerson;
