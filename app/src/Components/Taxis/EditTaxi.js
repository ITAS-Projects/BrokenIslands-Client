import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import "../../assets/EditTaxi.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function EditTaxi() {
    const { id } = useParams();
    const [spaceForKayaks, setSpaceForKayaks] = useState(0);
    const [spaceForPeople, setSpaceForPeople] = useState(0);
    const [running, setRunning] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${backendURL}/taxis/${id}`)
            .then((response) => response.data)
            .then(data => {
                setSpaceForKayaks(data.spaceForKayaks);
                setSpaceForPeople(data.spaceForPeople);
                setRunning(data.running);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (spaceForKayaks <= 0) {
            alert("Please provide a valid number of spaces for kayaks (greater than 0).");
            return;
        }

        if (spaceForPeople <= 0) {
            alert("Please provide a valid number of spaces for people (greater than 0).");
            return;
        }
        
        axios.put(`${backendURL}/taxis/${id}`, {
            spaceForKayaks: spaceForKayaks,
            spaceForPeople: spaceForPeople,
            running: running
        })
        .then(() => {
            alert('Taxi edited successfully!');
            window.location.href = '/taxis';
        })
        .catch(error => {
            console.error('Error editing taxi:', error);
            alert('There was an error while editing the taxi. Please try again.');
        });
    };
  
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Edit Taxi</h1>
            <form className="editTaxiForm" onSubmit={handleSubmit}>
                <div className="editTaxiFormField">
                    <label className="editTaxiLabel" htmlFor="spaceForKayaks">Space For Kayaks:</label>
                    <input
                        className="editTaxiInputNumber"
                        type="number"
                        id="spaceForKayaks"
                        value={spaceForKayaks}
                        onChange={e => setSpaceForKayaks(Number(e.target.value))}
                        min="1"
                        required
                    />
                </div>
                <br />
                <div className="newTaxiFormField">
                    <label className="newTaxiLabel" htmlFor="spaceForPeople">Space For People:</label>
                    <input
                        className="newTaxiInputNumber"
                        type="number"
                        id="spaceForPeople"
                        value={spaceForPeople}
                        onChange={e => setSpaceForPeople(Number(e.target.value))}
                        min="1"
                        required
                    />
                </div>
                <br />
                <div className="editTaxiFormField">
                    <label className="editTaxiLabel" htmlFor="running">Running:</label>
                    <input
                        className="editTaxiCheckbox"
                        type="checkbox"
                        id="running"
                        checked={running}
                        onChange={e => setRunning(e.target.checked)}
                    />
                </div>
                <br /><br />
                <button className="editTaxiButton" type="submit">Edit Taxi</button>
            </form>
        </div>
    );
}

export default EditTaxi;
