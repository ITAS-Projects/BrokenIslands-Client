import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../assets/AddTrip.css"; // Reuse styling from AddTrip

const EditTrip = () => {
  const { id } = useParams();

  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [day, setDay] = useState('');
  const [fromPlace, setFromPlace] = useState('');
  const [toPlace, setToPlace] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [numberOfBoats, setNumberOfBoats] = useState(0);

  const [selectedPeople, setSelectedPeople] = useState([]);
  const [selectedBoats, setSelectedBoats] = useState([]);
  const [selectedTaxi, setSelectedTaxi] = useState('');
  const [people, setPeople] = useState([]);
  const [boats, setBoats] = useState([]);
  const [taxis, setTaxis] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8081/trips/${id}`)
      .then(response => {
        const data = response.data;
        setTimeStart(data.timeStart);
        setTimeEnd(data.timeEnd);
        setDay(data.day.split('T')[0]);
        setFromPlace(data.fromPlace);
        setToPlace(data.toPlace);
        setNumberOfPeople(data.numberOfPeople);
        setNumberOfBoats(data.numberOfBoats);
        setSelectedPeople(data.People.map(person => person.id));
        setSelectedBoats(data.Boats.map(boat => boat.id));
        setSelectedTaxi(data.TaxiId || '');
      })
      .catch(error => console.error(`Error fetching trip ${id}:`, error));

    axios.get('http://localhost:8081/people')
      .then(response => setPeople(response.data))
      .catch(error => console.error('Error fetching people:', error));

    axios.get('http://localhost:8081/boats')
      .then(response => setBoats(response.data))
      .catch(error => console.error('Error fetching boats:', error));

    axios.get('http://localhost:8081/taxis')
      .then(response => setTaxis(response.data))
      .catch(error => console.error('Error fetching taxis:', error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8081/trips/${id}`, {
      timeStart,
      timeEnd,
      day,
      fromPlace,
      toPlace,
      numberOfPeople: Math.max(1, Number(numberOfPeople)),
      numberOfBoats: Math.max(0, Number(numberOfBoats)),
      personIds: selectedPeople,
      boatsIds: selectedBoats,
      TaxiId: selectedTaxi
    })
    .then(() => {
      alert('Trip updated successfully!');
      window.location.href = '/';
    })
    .catch(error => console.error('Error updating trip:', error));
  };

  return (
    <div className="trip-form-container">
      <h2>Edit Trip</h2>
      <form className="trip-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Time Start:</label>
          <input type='time' value={timeStart} onChange={e => setTimeStart(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Time End:</label>
          <input type='time' value={timeEnd} onChange={e => setTimeEnd(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Day:</label>
          <input type='date' value={day} onChange={e => setDay(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>From:</label>
          <input value={fromPlace} onChange={e => setFromPlace(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>To:</label>
          <input value={toPlace} onChange={e => setToPlace(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Number Of People:</label>
          <input 
            type='number' 
            value={numberOfPeople} 
            onChange={e => setNumberOfPeople(Math.max(1, Number(e.target.value)))} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Number Of Boats:</label>
          <input 
            type='number' 
            value={numberOfBoats} 
            onChange={e => setNumberOfBoats(Math.max(0, Number(e.target.value)))} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Select People:</label>
          <select multiple value={selectedPeople} onChange={e => {
            const options = Array.from(e.target.selectedOptions, option => option.value);
            setSelectedPeople(options);
          }}>
            {people.map(p => p.name && (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Boats:</label>
          <select multiple value={selectedBoats} onChange={e => {
            const options = Array.from(e.target.selectedOptions, option => option.value);
            setSelectedBoats(options);
          }}>
            {boats.map(b => (
              <option key={b.id} value={b.id}>{b.type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Taxi:</label>
          <select 
            value={selectedTaxi} 
            onChange={e => setSelectedTaxi(e.target.value)}
            required
          >
            <option value="" disabled>-- Select a Taxi --</option>
            {taxis.map(taxi => (
              <option key={taxi.id} value={taxi.id}>
                id:{taxi.id}, space:{taxi.spaceForKayaks}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">Save Trip</button>
      </form>
    </div>
  );
};

export default EditTrip;
