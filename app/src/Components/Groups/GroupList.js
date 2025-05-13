import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../../assets/GroupList.css";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function GroupList() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        axios.get(`${backendURL}/groups`)
            .then((response) => {
                setGroups(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);
  
    const handleDelete = (id) => {
      axios.delete(`${backendURL}/groups/${id}`)
        .then(response => {
          alert("Group deleted successfully");
          setGroups(groups.filter(group => group.id !== id)); // Update state to remove deleted person
        })
        .catch(error => console.error("Error deleting group:", error));
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h1>Group List</h1>
        <button onClick={() => window.location.href = `/groups/new`}>Add New Group</button>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Leader</th>
              <th>Unrelated people</th>
              <th>Number of People In Group</th>
              <th>Trip</th>
              <th>Management</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(group => (
              <tr key={group.id}>
                <td>{group.id}</td>
                <td>{group.leader?.name || "No Leader"}</td>
                <td>{group.seperatePeople ? "Yes" : "No"}</td>
                <td>{group.numberOfPeople}</td>
                <td>{group.Trips?.map(trip => {
                  return trip.timeFrame;
                }).join(", ")}</td>
                <td>
                  {/* <button onClick={() => window.location.href = `/groups/edit/${group.id}`}>Edit</button> */}
                  <button onClick={() => handleDelete(group.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default GroupList;