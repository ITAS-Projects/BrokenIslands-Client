import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import "../../assets/EditTrip.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function EditTrip() {
    const { id } = useParams();
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [day, setDay] = useState('');
    const [fromPlace, setFromPlace] = useState('');
    const [toPlace, setToPlace] = useState('');
    const [timeFrame, setTimeFrame] = useState('Secret to Lodge AM');
    const [reason, setReason] = useState('');
    const [taxiId, setTaxiId] = useState(0);
    const [taxis, setTaxis] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        Promise.all([
            axios.get(`${backendURL}/trips/${id}`)
            .then((response) => response.data)
            .then(data => {
                setTimeStart(data.timeStart || '');
                setTimeEnd(data.timeEnd || '');
                setDay(data.day.split('T')[0] || '');
                setFromPlace(data.fromPlace || '');
                setToPlace(data.toPlace || '');
                setTimeFrame(data.timeFrame || '');
                setReason(data.reason || '');
                return data.TaxiId;
            }),

            axios.get(`${backendURL}/taxis`)
            .then((response) => response.data)
            .then(data => {
                data.map(taxi => taxi.id);
                setTaxis(data);
                return data[0]?.id;
            })
          ])
          .then(([tripId, taxiBackupId]) => {
            setTaxiId(tripId || taxiBackupId || '');
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            setLoading(false);
          });

        
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`${backendURL}/trips/${id}`, {
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
            alert('Trip edited successfully!');
            window.location.href = '/trips';
        })
        .catch(error => {
            console.error('Error editing trip:', error);
            alert('There was an error while editing the trip. Please try again.');
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Edit Trip</h1>
            <form className="editTripForm" onSubmit={handleSubmit}>
                <div className="editTripFormField">
                    <label className="editTripLabel" htmlFor="timeStart">Start Time:</label>
                    <input
                        className="editTripInputTime"
                        type="time"
                        id="timeStart"
                        value={timeStart}
                        onChange={e => setTimeStart(e.target.value)}
                    />
                </div>
                <br />
                <div className="editTripFormField">
                    <label className="editTripLabel" htmlFor="timeEnd">End Time:</label>
                    <input
                        className="editTripInputTime"
                        type="time"
                        id="timeEnd"
                        value={timeEnd}
                        onChange={e => setTimeEnd(e.target.value)}
                    />
                </div>
                <br />
                <div className="editTripFormField">
                    <label className="editTripLabel" htmlFor="day">Day:</label>
                    <input
                        className="editTripInputDay"
                        type="date"
                        id="day"
                        value={day}
                        onChange={e => setDay(e.target.value)}
                    />
                </div>
                <br />
                <div className="editTripFormField">
                    <label className="editTripLabel" htmlFor="fromPlace">From Place:</label>
                    <input
                        className="editTripInputText"
                        type="text"
                        id="fromPlace"
                        value={fromPlace}
                        onChange={e => setFromPlace(e.target.value)}
                    />
                </div>
                <br />
                <div className="editTripFormField">
                    <label className="editTripLabel" htmlFor="toPlace">To Place:</label>
                    <input
                        className="editTripInputText"
                        type="text"
                        id="toPlace"
                        value={toPlace}
                        onChange={e => setToPlace(e.target.value)}
                    />
                </div>
                <br />
                <div className="editTripFormField">
                    <label className="editTripLabel" htmlFor="timeFrame">Time Frame:</label>
                    <select
                        className="editTripInputSelect"
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
                <div className="editTripFormField">
                    <label className="editTripLabel" htmlFor="reason">Reason / Notes:</label>
                    <input
                        className="editTripInputSelect"
                        type="text"
                        id="reason"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                    />
                </div>
                <br />
                <div className="editTripFormField">
                    <label className="editTripLabel" htmlFor="taxi">Taxi:</label>
                    <select
                        className="editTripInputSelect"
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
                <button className="editTripButton" type="submit">Edit Trip</button>
            </form>
        </div>
    );
}

export default EditTrip;
