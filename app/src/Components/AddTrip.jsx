import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../assets/AddTrip.css";

const AddTrip = () => {
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [day, setDay] = useState('');
  const [fromPlace, setFromPlace] = useState('');
  const [toPlace, setToPlace] = useState('');
  const [numberOfBoats, setNumberOfBoatsHidden] = useState(1);
  let updateNumberOfBoats = (additive = 0, selectedTaxiTemp = selectedTaxi) => {
    let totalBoats = (numberOfCanoes + numberOfSingleKayaks + numberOfDoubleKayaks + additive);
    let maxSpace = taxis.find(t => t.id == selectedTaxiTemp)?.spaceForKayaks || 0;
    if(totalBoats > maxSpace){
      if (numberOfCanoes + numberOfSingleKayaks + numberOfDoubleKayaks > maxSpace) {
        setNumberOfCanoesHidden(0);
        setNumberOfSingleKayaksHidden(0);
        setNumberOfDoubleKayaksHidden(0);
      }
      return false
    }
    setNumberOfBoatsHidden(Math.max(0, (numberOfCanoes + numberOfSingleKayaks + numberOfDoubleKayaks + additive)));
    return true;
  }
  const [numberOfPeople, setNumberOfPeopleHidden] = useState(1);
  let setNumberOfPeople = (number) => {
    setNumberOfPeopleHidden(Math.max(1, number));
  }
  const [numberOfSingleKayaks, setNumberOfSingleKayaksHidden] = useState(0);
  let setNumberOfSingleKayaks = (number) => {
    if (updateNumberOfBoats(number - numberOfSingleKayaks)) {
      setNumberOfSingleKayaksHidden(Math.max(0, number));
    }
  }
  const [numberOfDoubleKayaks, setNumberOfDoubleKayaksHidden] = useState(0);
  let setNumberOfDoubleKayaks = (number) => {
    if (updateNumberOfBoats(number - numberOfDoubleKayaks)) {
      setNumberOfDoubleKayaksHidden(Math.max(0, number));
    }
  }
  const [numberOfCanoes, setNumberOfCanoesHidden] = useState(0);
  let setNumberOfCanoes = (number) => {
    if (updateNumberOfBoats(number - numberOfCanoes)) {
      setNumberOfCanoesHidden(Math.max(0, number));
    }
  }


  const [selectedPeople, setSelectedPeople] = useState([]);
  const [selectedTaxi, setSelectedTaxi] = useState("");
  const [people, setPeople] = useState([]);
  const [taxis, setTaxis] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/people')
      .then(response => setPeople(response.data))
      .catch(error => console.error('Error fetching people:', error));

    axios.get('http://localhost:8081/taxis')
      .then(response => setTaxis(response.data))
      .catch(error => console.error('Error fetching taxis:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const boats = [
      { number: numberOfCanoes, type: "Canoes" },
      { number: numberOfDoubleKayaks, type: "Double Kayaks" },
      { number: numberOfSingleKayaks, type: "Single Kayaks" }
    ];
    
    const validBoats = boats.filter(boat => boat.number > 0);
    
    Promise.all(
      validBoats.map(boat =>
        axios.post('http://localhost:8081/boats', {
          type: boat.type,
          numberOf: boat.number,
          isRented: false
        })
        .then(responce => responce.data.id)
      )
    )
    .then(results => {
      axios.post('http://localhost:8081/trips', {
        timeStart: timeStart,
        timeEnd: timeEnd,
        day: day,
        fromPlace: fromPlace,
        toPlace: toPlace,
        personIds: selectedPeople,
        boatsIds: results,
        TaxiId: selectedTaxi,
        numberOfPeople: numberOfPeople,
        numberOfBoats: numberOfBoats
      })
        .then(() => {
          alert('trip added successfully!');
          window.location.href = '/';
        })
        .catch(error => console.error('Error adding trip:', error));
    })
    .catch(error => {
      console.error('Error with one of the fetches:', error);
    });
  };

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
          <label>Boats:</label>
          <div>
            <label>
            number of single kayaks:
            </label>
            <input type='number' value={numberOfSingleKayaks} onChange={e => setNumberOfSingleKayaks(e.target.value)} required />
            <br/>
            <label>  
            number of double kayaks:
            </label>
            <input type='number' value={numberOfDoubleKayaks} onChange={e => setNumberOfDoubleKayaks(e.target.value)} required />
            <br/>
            <label>
            number of canoes:
            </label>
            <input type='number' value={numberOfCanoes} onChange={e => setNumberOfCanoes(e.target.value)} required />
          </div>
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
          <label>Select Taxi:</label>
          <select
            value={selectedTaxi}
            onChange={e => {
              setSelectedTaxi(e.target.value);
              updateNumberOfBoats(0, e.target.value);
            }}
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
