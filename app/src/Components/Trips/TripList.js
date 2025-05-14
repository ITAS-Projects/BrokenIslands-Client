import React, { useEffect, useState } from "react";
import axiosAuth from "../authRequest";
import "../../assets/TripList.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function TripList() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        axiosAuth.get(`${backendURL}/trips`)
            .then((response) => {
                let tempTrips = response.data;
                tempTrips.map(trip => {
                  let numOfBoats = 0;
                  let numOfPeople = 0;
                  trip.Groups?.forEach(group => {
                    group.Boats?.forEach(boat => {
                      numOfBoats += boat.numberOf;
                    });
                    numOfPeople += group.numberOfPeople;
                  });
                  trip.People?.Boats?.forEach(boat => {
                    numOfBoats += boat.numberOf;
                  })
                  numOfPeople += trip.People?.numberOfPeople;
                  trip.Reservations?.forEach(reservation => {
                    reservation.Boats?.forEach(boat => {
                      numOfBoats += boat.numberOf;
                    })
                    numOfPeople += reservation.Group?.numberOfPeople;
                  })
                  trip.numOfBoats = numOfBoats;
                  trip.numOfPeople = numOfPeople;
                  return trip;
                })
                setTrips(tempTrips);

                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);
  
    const handleDelete = (id) => {
      axiosAuth.delete(`${backendURL}/trips/${id}`)
        .then(response => {
          alert("Trip deleted successfully");
          setTrips(trips.filter(trip => trip.id !== id)); // Update state to remove deleted person
        })
        .catch(error => console.error("Error deleting trip:", error));
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h1>Trip List</h1>
        <button onClick={() => window.location.href = `/trips/new`}>Add New Trip</button>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Number Of Boats</th>
              <th>Number Of People</th>
              <th>Management</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(trip => (
              <tr key={trip.id}>
                <td>{trip.id}</td>
                <td>{trip.numOfBoats}/{trip.Taxi?.spaceForKayaks || 0}</td>
                <td>{trip.numOfPeople || 0}</td>
                <td>
                  <button onClick={() => window.location.href = `/trips/edit/${trip.id}`}>Edit</button>
                  <button onClick={() => handleDelete(trip.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default TripList;