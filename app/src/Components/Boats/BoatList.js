import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../../assets/BoatList.css";

function BoatList() {
    const [boats, setBoats] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        axios.get('http://localhost:8081/boats')
            .then((response) => {
                let tempBoats = response.data;
                let result = tempBoats.map(boat => {
                  let boatSource = '';
                  if (boat.GroupId == null) {
                    if (boat.ReservationId == null) {
                      boatSource = 'Not Assigned'
                    } else {
                      boatSource = `Reservation Leader: ${boat.Reservation?.Group?.leader?.name}`;
                    }
                  } else {
                    if (boat.Group.seperatePeople) {
                      boatSource = `People in Group: ${boat.Group?.numberOfPeople}`;
                    } else {
                      boatSource = `Group Leader: ${boat.Group?.leader?.name}`;
                    }
                  }
                  boat.chosenGroup = boatSource;
                  return boat;
                })
                setBoats(result);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);
  
    const handleDelete = (id) => {
      axios.delete(`http://localhost:8081/boats/${id}`)
        .then(response => {
          alert("Boat deleted successfully");
          setBoats(boats.filter(boat => boat.id !== id)); // Update state to remove deleted person
        })
        .catch(error => console.error("Error deleting boat:", error));
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h1>Boat List</h1>
        <button onClick={() => window.location.href = `/boats/new`}>Add New Boat</button>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Type Of Boats</th>
              <th>Amount Of The Boats</th>
              <th>Is Rented</th>
              <th>From source</th>
              <th>Management</th>
            </tr>
          </thead>
          <tbody>
            {boats.map(boat => (
              <tr key={boat.id}>
                <td>{boat.id}</td>
                <td>{boat.type}</td>
                <td>{boat.numberOf}</td>
                <td>{boat.isRented ? "Yes" : "No"}</td>
                <td>{boat.chosenGroup}</td>
                <td>
                  <button onClick={() => window.location.href = `/boats/edit/${boat.id}`}>Edit</button>
                  <button onClick={() => handleDelete(boat.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default BoatList;