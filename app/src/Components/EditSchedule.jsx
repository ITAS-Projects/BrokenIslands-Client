import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditSchedule = () => {
  const { id } = useParams();
  const [costOverride, setName] = useState('');
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    // Fetch people and schedules at the same time
      axios.get(`http://localhost:8081/schedules/${id}`)
        .then(response => response.data)
        .then(data => {
          setName(data.costOverride);
          setSelectedPeople(data.People.map(person => person.id));
        })
        .catch(error => console.error(`Error fetching schedule ${id}:`, error))

      axios.get('http://localhost:8081/people')
        .then(response => setPeople(response.data))
        .catch(error => console.error('Error fetching people:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8081/schedules/${id}`, {
        costOverride: costOverride,
      personIds: selectedPeople
    })
    .then(() => {
      alert('Schedule updated successfully!');
      window.location.href = '/';
    })
    .catch(error => console.error('Error updating schedule:', error));
  };

  return (
    <div>
      <h2>Edit Schedule</h2>
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
        <button type="submit">Save Schedule</button>
      </form>
    </div>
  );
};

export default EditSchedule;
