import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSchedule = () => {
  const [costOverride, setName] = useState('');
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/people')
      .then(response => setPeople(response.data))
      .catch(error => console.error('Error fetching people:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/schedules', {
        costOverride: costOverride,
      personIds: selectedPeople
    })
    .then(() => {
      alert('Schedule added successfully!');
      window.location.href = '/';
    })
    .catch(error => console.error('Error adding schedule:', error));
  };

  return (
    <div>
      <h2>Add New Schedule</h2>
      <form onSubmit={handleSubmit}>
        <label>Schedule Name: </label>
        <input value={costOverride} onChange={e => setName(e.target.value)} required />
        <br /><br />
        <label>Select People:</label>
        <select multiple value={selectedPeople} onChange={e => {
          const options = Array.from(e.target.selectedOptions, option => option.value);
          setSelectedPeople(options);
        }}>
          {people.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <br /><br />
        <button type="submit">Add Schedule</button>
      </form>
    </div>
  );
};

export default AddSchedule;
