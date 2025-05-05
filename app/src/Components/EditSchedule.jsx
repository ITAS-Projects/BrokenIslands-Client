import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditSchedule = () => {
  const { id } = useParams();
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [day, setDay] = useState('');
  const [fromPlace, setFromPlace] = useState('');
  const [toPlace, setToPlace] = useState('');
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
    // Fetch people and schedules at the same time
      axios.get(`http://localhost:8081/schedules/${id}`)
        .then(response => response.data)
        .then(data => {
          setTimeStart(data.timeStart);
          setTimeEnd(data.timeEnd);
          setDay(data.day.split('T')[0]);
          setFromPlace(data.fromPlace);
          setToPlace(data.toPlace);
          setReason(data.reason);
          setNumberOfPeople(data.numberOfPeople);
          setSelectedPeople(data.People.map(person => person.id));
          setNumberOfBoats(data.numberOfBoats);
          setSelectedBoats(data.Boats.map(boat => boat.id));
        })
        .catch(error => console.error(`Error fetching schedule ${id}:`, error))

      axios.get('http://localhost:8081/people')
        .then(response => setPeople(response.data))
        .catch(error => console.error('Error fetching people:', error));

      axios.get('http://localhost:8081/boats')
        .then(response => setBoats(response.data))
        .catch(error => console.error('Error fetching boats:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8081/schedules/${id}`, {
      timeStart: timeStart,
      timeEnd: timeEnd,
      day: day,
      fromPlace: fromPlace,
      toPlace: toPlace,
      reason: reason,
      personIds: selectedPeople,
      boatsIds: selectedBoats,
      numberOfPeople: numberOfPeople,
      numberOfBoats: numberOfBoats
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
        <button type="submit">Save Schedule</button>
      </form>
    </div>
  );
};

export default EditSchedule;
