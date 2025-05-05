import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../assets/AddTrip.css";

const AddTrip = () => {
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [day, setDay] = useState('');
  const [fromPlace, setFromPlace] = useState('');
  const [toPlace, setToPlace] = useState('');
  const [numberOfPeople, setNumberOfPeopleHidden] = useState(1);
  let setNumberOfPeople = (number) => {
    setNumberOfPeopleHidden(Math.max(1, number));
  }
  const [numberOfBoats, setNumberOfBoatsHidden] = useState(0);
  let setNumberOfBoats = (number) => {
    setNumberOfBoatsHidden(Math.max(0, number));
  }


  const [selectedPeople, setSelectedPeople] = useState([]);
  const [selectedBoats, setSelectedBoats] = useState([]);
  const [selectedTaxi, setSelectedTaxi] = useState("");
  const [people, setPeople] = useState([]);
  const [boats, setBoats] = useState([]);
  const [taxis, setTaxis] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/people')
      .then(response => setPeople(response.data))
      .catch(error => console.error('Error fetching people:', error));

    axios.get('http://localhost:8081/boats')
      .then(response => setBoats(response.data))
      .catch(error => console.error('Error fetching boats:', error));
    axios.get('http://localhost:8081/taxis')
      .then(response => setTaxis(response.data))
      .catch(error => console.error('Error fetching taxis:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/trips', {
      timeStart: timeStart,
      timeEnd: timeEnd,
      day: day,
      fromPlace: fromPlace,
      toPlace: toPlace,
      personIds: selectedPeople,
      boatsIds: selectedBoats,
      TaxiId: selectedTaxi,
      numberOfPeople: numberOfPeople,
      numberOfBoats: numberOfBoats
    })
      .then(() => {
        alert('trip added successfully!');
        window.location.href = '/';
      })
      .catch(error => console.error('Error adding trip:', error));
  };

  function trimUndefined(arr) {
    let movingIndex = arr.length - 1;
  
    while (movingIndex >= 0) {
      if (arr[movingIndex] === undefined) {
        arr.splice(movingIndex, 1); // Remove the undefined value at this index
      }
      movingIndex--;
    }
    
    return arr;
  }

  return (
    <div className="trip-form-container">
      <h2>Add New Trip</h2>
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
        <br />

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
          <input type='number' value={numberOfPeople} onChange={e => setNumberOfPeople(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Number Of Boats:</label>
          <input type='number' value={numberOfBoats} onChange={e => setNumberOfBoats(e.target.value)} required />
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

        {numberOfBoats > 0 && (
          <div className="form-group">
            {numberOfBoats < selectedBoats.length && (
            <label className='error-message'>Too Many Boats, please increase the number of boats, or remove some</label>
            ) || (
            <label>Select Boat{numberOfBoats > 1 && "s"}:</label>
            )}
            {Array.from({ length: numberOfBoats }).map((_, index) => (
              <select
                key={index}
                value={selectedBoats[index] || ""}
                onChange={(e) => {
                  const newSelectedBoats = [...selectedBoats];
                  let value = e.target.value;
                  if (value == "") {
                    value = undefined;
                  }
                  newSelectedBoats[index] = value;
                  setSelectedBoats(trimUndefined(newSelectedBoats));
                }}
              >
                <option value="">-- Select a boat --</option>
                {boats.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.type}
                  </option>
                ))}
              </select>
            ))}
            {selectedBoats.slice(numberOfBoats).map((_, index) => (
              <select
                key={index + numberOfBoats}
                value={selectedBoats[index + numberOfBoats] || undefined}
                onChange={(e) => {
                  const newSelectedBoats = [...selectedBoats];
                  let value = e.target.value;
                  if (value == "") {
                    value = undefined;
                  }
                  newSelectedBoats[index + numberOfBoats] = value;
                  setSelectedBoats(trimUndefined(newSelectedBoats));
                }}
              >
                <option value="">-- Select a boat --</option>
                {boats.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.type}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}

        <div className="form-group">
          <label>Select Taxi:</label>
          <select
            value={selectedTaxi}
            onChange={e => setSelectedTaxi(e.target.value)}
            required
          >
            <option value="" disabled>-- Select a Taxi --</option>
            {taxis.map(b => (
              <option key={b.id} value={b.id}>
                id:{b.id}, space:{b.spaceForKayaks}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">Add Trip</button>
      </form>
    </div>
  );
};

export default AddTrip;
