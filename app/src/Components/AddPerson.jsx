import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddPerson = () => {
  const [name, setName] = useState('');
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/schedules')
      .then(response => setSchedules(response.data))
      .catch(error => console.error('Error fetching schedules:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/people', {
      name,
      scheduleIds: selectedSchedules
    })
    .then(() => {
      alert('Person added successfully!');
      window.location.href = '/';
    })
    .catch(error => console.error('Error adding person:', error));
  };

  return (
    <div>
      <h2>Add New Person</h2>
      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input value={name} onChange={e => setName(e.target.value)} required />
        <br /><br />
        <label>Select Schedules:</label>
        <select multiple value={selectedSchedules} onChange={e => {
          const options = Array.from(e.target.selectedOptions, option => option.value);
          setSelectedSchedules(options);
        }}>
          {schedules.map(s => (
            <option key={s.id} value={s.id}>{s.costOverride}</option>
          ))}
        </select>
        <br /><br />
        <button type="submit">Add Person</button>
      </form>
    </div>
  );
};

export default AddPerson;
