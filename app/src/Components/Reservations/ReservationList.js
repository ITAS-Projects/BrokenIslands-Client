import React, { useEffect, useState } from "react";
import axiosAuth from "../authRequest";
import "../../assets/ReservationList.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function ReservationList() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        axiosAuth.get(`${backendURL}/reservations`)
            .then((response) => {
                setReservations(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);
  
    const handleDelete = (id) => {
      axiosAuth.delete(`${backendURL}/reservations/${id}`)
        .then(response => {
          alert("Reservation deleted successfully");
          setReservations(reservations.filter(reservation => reservation.id !== id)); // Update state to remove deleted person
        })
        .catch(error => console.error("Error deleting reservation:", error));
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h1>Reservation List</h1>
        {/* <button onClick={() => window.location.href = `/reservations/new`}>Add New Reservation</button> */}
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Leader</th>
              <th>Trips</th>
              <th>Management</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => (
              <tr key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{reservation.Group?.leader?.name || "No Leader"}</td>
                <td>{reservation.Trips?.map(trip => {
                  return trip.timeFrame;
                }).join(", ") || "None"}</td>
                <td>
                  {/* <button onClick={() => window.location.href = `/reservations/edit/${reservation.id}`}>Edit</button> */}
                  <button onClick={() => handleDelete(reservation.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default ReservationList;