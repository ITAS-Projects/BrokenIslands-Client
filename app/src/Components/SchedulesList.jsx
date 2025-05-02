import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SchedulesList = () => {
  const [schedules, setSchedules] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch people and schedules at the same time
    Promise.all([
      axios.get('http://localhost:8081/people'),
      axios.get('http://localhost:8081/schedules')
    ])
    .then(([peopleResponse, schedulesResponse]) => {
      setPeople(peopleResponse.data);
      setSchedules(schedulesResponse.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/schedules/${id}`)
      .then(response => {
        alert("Schedule deleted successfully");
        setSchedules(schedules.filter(schedule => schedule.id !== id)); // Update state to remove deleted person
      })
      .catch(error => console.error("Error deleting schedule:", error));
  };

  const getPeople = (data) => {
    return [data.length, data.map(person => person.name).join(', ')].join(': ');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Schedules List</h1>
      <button onClick={() => window.location.href = `/schedule/new`}>Add New Schedule</button>
      <table>
        <thead>
          <tr>
            <th>Time Start</th>
            <th>Time End</th>
            <th>Day</th>
            <th>From Place</th>
            <th>To Place</th>
            <th>Cost</th>
            <th>Reason / Notes</th>
            <th>People</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(schedule => (
            <tr key={schedule.id}>
              <td>{schedule.timeStart}</td>
              <td>{schedule.timeEnd}</td>
              <td>{schedule.day.split('T')[0]}</td>
              <td>{schedule.fromPlace}</td>
              <td>{schedule.toPlace}</td>
              <td>{schedule.costOverride}</td>
              <td>{schedule.reason}</td>
              <td>{getPeople(schedule.People)}</td>
              <td>
                <button onClick={() => window.location.href = `/schedule/edit/${schedule.id}`}>Edit</button>
                <button onClick={() => handleDelete(schedule.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulesList;
