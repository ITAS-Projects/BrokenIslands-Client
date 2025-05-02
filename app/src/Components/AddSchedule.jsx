import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSchedule = () => {
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [day, setDay] = useState('');
  const [fromPlace, setFromPlace] = useState('');
  const [toPlace, setToPlace] = useState('');
  const [costOverride, setCostOverride] = useState('');
  const [reason, setReason] = useState('');
  const [numberOfPeople, setNumberOfPeopleHidden] = useState(1);
  let setNumberOfPeople = (number) => {
    setNumberOfPeopleHidden(Math.max(1,number));
  }
  const [numberOfBoats, setNumberOfBoatsHidden] = useState(0);
  let setNumberOfBoats = (number) => {
    setNumberOfBoatsHidden(Math.max(0,number));
  }

  
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [selectedBoats, setSelectedBoats] = useState([]);
  const [people, setPeople] = useState([]);
  const [boats, setBoats] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/people')
      .then(response => setPeople(response.data))
      .catch(error => console.error('Error fetching people:', error));

    axios.get('http://localhost:8081/boats')
      .then(response => setBoats(response.data))
      .catch(error => console.error('Error fetching boats:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/schedules', {
      timeStart: timeStart,
      timeEnd: timeEnd,
      day: day,
      fromPlace: fromPlace,
      toPlace: toPlace,
      costOverride: costOverride,
      reason: reason,
      personIds: selectedPeople,
      boatsIds: selectedBoats,
      numberOfPeople: numberOfPeople,
      numberOfBoats: numberOfBoats
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
        <label>Time Start: </label>
        <input type='time' value={timeStart} onChange={e => setTimeStart(e.target.value)} required />
        <label>Time End: </label>
        <input type='time' value={timeEnd} onChange={e => setTimeEnd(e.target.value)} required />
        <label>Day: </label>
        <input type='date' value={day} onChange={e => setDay(e.target.value)} required />
        <label>From: </label>
        <input value={fromPlace} onChange={e => setFromPlace(e.target.value)} required />
        <label>To: </label>
        <input value={toPlace} onChange={e => setToPlace(e.target.value)} required />
        <label>Cost: </label>
        <input value={costOverride} onChange={e => setCostOverride(e.target.value)} />
        <label>Reason (Notes): </label>
        <input value={reason} onChange={e => setReason(e.target.value)} />
        <label>Number Of People: </label>
        <input type='number' value={numberOfPeople} onChange={e => setNumberOfPeople(e.target.value)} required />
        <label>Number Of Boats: </label>
        <input type='number' value={numberOfBoats} onChange={e => setNumberOfBoats(e.target.value)} required />
        <br /><br />
        <label>Select People:</label>
        <select multiple value={selectedPeople} onChange={e => {
          const options = Array.from(e.target.selectedOptions, option => option.value);
          setSelectedPeople(options);
        }}>
          {people.map(p => {
            if (p.name.length > 0) {

              return(
              <option key={p.id} value={p.id}>{p.name}</option>
              )
            }
            })
          }
          
        </select>
        <label>Select Boats:</label>
        <select multiple value={selectedBoats} onChange={e => {
          const options = Array.from(e.target.selectedOptions, option => option.value);
          setSelectedBoats(options);
        }}>
          {boats.map(b => (
              <option key={b.id} value={b.id}>{b.type}</option>
              )
            )
          }
          
        </select>
        <br /><br />
        <button type="submit">Add Schedule</button>
      </form>
    </div>
  );
};

export default AddSchedule;
