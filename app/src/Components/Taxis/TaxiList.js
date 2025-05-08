import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../../assets/TaxiList.css";

function TaxiList() {
    const [taxis, setTaxis] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        axios.get('http://localhost:8081/taxis')
            .then((response) => {
                setTaxis(response.data)
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);
  
    const handleDelete = (id) => {
      axios.delete(`http://localhost:8081/taxis/${id}`)
        .then(response => {
          alert("Taxi deleted successfully");
          setTaxis(taxis.filter(taxi => taxi.id !== id)); // Update state to remove deleted person
        })
        .catch(error => console.error("Error deleting taxi:", error));
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h1>Taxi List</h1>
        <button onClick={() => window.location.href = `/taxis/new`}>Add New Taxi</button>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Space for kayaks</th>
              <th>Space for people</th>
              <th>Running</th>
              <th>Management</th>
            </tr>
          </thead>
          <tbody>
            {taxis.map(taxi => (
              <tr key={taxi.id}>
                <td>{taxi.id}</td>
                <td>{taxi.spaceForKayaks}</td>
                <td>{taxi.spaceForPeople}</td>
                <td>{taxi.running ? "yes" : "no"}</td>
                <td>
                  <button onClick={() => window.location.href = `/taxis/edit/${taxi.id}`}>Edit</button>
                  <button onClick={() => handleDelete(taxi.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default TaxiList;