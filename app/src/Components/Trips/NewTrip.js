import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../../assets/NewTrip.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function NewTrip() {
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [day, setDay] = useState('');
    const [fromPlace, setFromPlace] = useState('');
    const [toPlace, setToPlace] = useState('');
    const [timeFrame, setTimeFrame] = useState('Secret to Lodge AM');
    const [reason, setReason] = useState('');
    const [taxiId, setTaxiId] = useState();
    const [taxis, setTaxis] = useState([]);

    useEffect(() => {
        axios.get(`${backendURL}/taxis`)
            .then((response) => response.data)
            .then(data => {
                data.map(taxi => taxi.id);
                setTaxis(data);
                setTaxiId(data[0]?.id);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${backendURL}/trips`, {
            timeStart: timeStart,
            timeEnd: timeEnd,
            day: day,
            fromPlace: fromPlace,
            toPlace: toPlace,
            timeFrame: timeFrame,
            reason: reason,
            TaxiId: taxiId,
        })
        .then(() => {
            alert('Trip added successfully!');
            window.location.href = '/trips';
        })
        .catch(error => {
            console.error('Error adding trip:', error);
            alert('There was an error while adding the trip. Please try again.');
        });
    };

    return (
        <div>
            <h1>New Trip</h1>
            <form className="newTripForm" onSubmit={handleSubmit}>
                <div className="newTripFormField">
                    <label className="newTripLabel" htmlFor="timeStart">Start Time:</label>
                    <input
                        className="newTripInputTime"
                        type="time"
                        id="timeStart"
                        value={timeStart}
                        onChange={e => setTimeStart(e.target.value)}
                        min="1"
                        required
                    />
                </div>
                <br />
                <div className="newTripFormField">
                    <label className="newTripLabel" htmlFor="timeEnd">End Time:</label>
                    <input
                        className="newTripInputTime"
                        type="time"
                        id="timeEnd"
                        value={timeEnd}
                        onChange={e => setTimeEnd(e.target.value)}
                    />
                </div>
                <br />
                <div className="newTripFormField">
                    <label className="newTripLabel" htmlFor="day">Day:</label>
                    <input
                        className="newTripInputDay"
                        type="date"
                        id="day"
                        value={day}
                        onChange={e => setDay(e.target.value)}
                    />
                </div>
                <br />
                <div className="newTripFormField">
                    <label className="newTripLabel" htmlFor="fromPlace">From Place:</label>
                    <input
                        className="newTripInputText"
                        type="text"
                        id="fromPlace"
                        value={fromPlace}
                        onChange={e => setFromPlace(e.target.value)}
                    />
                </div>
                <br />
                <div className="newTripFormField">
                    <label className="newTripLabel" htmlFor="toPlace">To Place:</label>
                    <input
                        className="newTripInputText"
                        type="text"
                        id="toPlace"
                        value={toPlace}
                        onChange={e => setToPlace(e.target.value)}
                    />
                </div>
                <br />
                <div className="newTripFormField">
                    <label className="newTripLabel" htmlFor="timeFrame">Time Frame:</label>
                    <select
                        className="newTripInputSelect"
                        id="timeFrame"
                        value={timeFrame}
                        onChange={e => setTimeFrame(e.target.value)}
                    >
                        <option>Custom AM</option>
                        <option>Lodge to Secret AM</option>
                        <option>Secret to Lodge AM</option>
                        <option>Custom</option>
                        <option>Lodge to Secret PM</option>
                        <option>Secret to Lodge PM</option>
                        <option>Custom PM</option>
                    </select>
                </div>
                <br />
                <div className="newTripFormField">
                    <label className="newTripLabel" htmlFor="reason">Reason / Notes:</label>
                    <input
                        className="newTripInputSelect"
                        type="text"
                        id="reason"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                    />
                </div>
                <br />
                <div className="newTripFormField">
                    <label className="newTripLabel" htmlFor="taxi">Taxi:</label>
                    <select
                        className="newTripInputSelect"
                        id="taxi"
                        value={taxiId}
                        onChange={e => setTaxiId(e.target.value)}
                    >
                        {taxis.map(taxi => (
                            <option key={taxi.id} value={taxi.id}>Space:{taxi.spaceForKayaks}, Running:{taxi.running ? "Yes" : "No"}</option>
                        ))}
                    </select>
                </div>
                <br /><br />
                <button className="newTripButton" type="submit">Add Trip</button>
            </form>
        </div>
    );
}

export default NewTrip;
