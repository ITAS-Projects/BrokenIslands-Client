import React from "react";
import axios from 'axios';

function Review({ data, onBack }) {

  const compareTimes = (t1, t2) => {
    const [h1, m1] = t1.split(':').map(Number);
    const [h2, m2] = t2.split(':').map(Number);

    if (h1 !== h2) return h1 - h2;
    return m1 - m2;
  }

  const handleSubmit = () => {
    let arrivalCustom = false;
    let departureCustom = false;

    let scheduleToTime = {
      "Lodge to Secret AM": "9:15",
      "Secret to Lodge AM": "10:15",
      "Lodge to Secret PM": "15:15",
      "Secret to Lodge PM": "16:00"
    }

    if (data.ArrivalSchedule === "") {alert('The Arrival Schedule doesnt exist');return null}
    if (data.DepartureSchedule === "") {alert('The Departure Schedule doesnt exist');return null}

    if (data.ArrivalDay === "") {alert('The Arrival Day doesnt exist');return null}
    if (data.DepartureDay === "") {alert('The Departure Day doesnt exist');return null}

    if (data.ArrivalSchedule.split(" ")[0] == "Custom") {arrivalCustom = true}
    if (data.DepartureSchedule.split(" ")[0] == "Custom") {departureCustom = true}
    if (arrivalCustom && data.ArrivalTime === "") {alert('The Arrival time doesnt exist');return null}
    if (departureCustom && data.DepartureTime === "") {alert('The Departure time doesnt exist');return null}

    if (data.NumberOfPeople < 1) {return null}
    if (!/[a-zA-Z]/.test(data.People?.[0]?.name || '')) {alert('The Reservation name doesnt exist');return null}
    for (let person of data.People) {
      if (!person.name) {
        alert('There is a person without a name');
        return null;
      }
    }    
    if (data.NumberOfPeople < data.People.length) {alert('There are too many people with data');return null}
  
    let arrivalDay = new Date(data.ArrivalDay.split('T')[0]);
    let departureDay = new Date(data.DepartureDay.split('T')[0]);

    if (arrivalDay > departureDay) {
      alert('The Departure is before the Arrival');
      return null;
    } else if ( data.ArrivalDay.split('T')[0] === data.DepartureDay.split('T')[0]) {
      if (arrivalCustom) {
        if (departureCustom) {
         if ( compareTimes(data.ArrivalTime, data.DepartureTime) >= 0 ) {alert('The time leaving is the same or before time ariving');return null}
        } else {
         if ( compareTimes(data.ArrivalTime, scheduleToTime[data.DepartureSchedule]) >= 0 ) {alert('The schedule for leaving is the same or before time ariving');return null}
        }
      } else if (departureCustom) {
        if ( compareTimes(scheduleToTime[data.ArrivalSchedule], data.DepartureTime) >= 0 ) {alert('The time leaving is the same or before schedule for ariving');return null}
      } else {
        if ( compareTimes(scheduleToTime[data.ArrivalSchedule], scheduleToTime[data.DepartureSchedule]) >= 0 ) {alert('The schedule for leaving is the same or before schedule for ariving');return null}
      }
    }

    for (let boat of data.Boats) {
      if (boat.type === "") {alert('There is a group of boats without a type');return null}
      if ((boat.numberOf || 0) <= 0) {alert('There is a group of boats with less than one boat in it');return null}
    }  

    return null;

    // Promise.all([
    //   data.
    // ])

    let trips;
    let groupId;
    Promise.all([
      Promise.all(
        data.People.map(person =>
          axios.post('http://localhost:8081/people', {
            name: person.name,
            allergies: person.allergies
          }).then(response => response.data.id)
        )
      ),
      Promise.all(
        data.Boats.map(boat =>
          axios.post('http://localhost:8081/boats', {
            type: boat.type,
            numberOf: boat.numberOf,
            rented: boat.rented
          }).then(response => response.data.id)
        )
      )
    ])
    .then(([PeopleIds, BoatIds]) => {
      console.log('People IDs:', PeopleIds);
      console.log('Boat IDs:', BoatIds);
      // continue logic here
    })    
    .catch(error => {
        console.error('Error adding people:', error);
        alert('There was an error while adding data. Please try again.');
    });

    
    // axios.post('http://localhost:8081/reservations', {
    //   TripIds: trips,
    //   GroupId: groupId
    // })
    // .then(() => {
    //     alert('Trip added successfully!');
    //     window.location.href = '/trips';
    // })
    // .catch(error => {
    //     console.error('Error adding trip:', error);
    //     alert('There was an error while adding the trip. Please try again.');
    // });
  };

    return (
        <div>
            <h2>Step 4: Review</h2>
            <p>
              <strong>Reservation Name:</strong> { data.People[0].name }
            </p>
            {Object.entries(data).map(([key, value]) => {
              if (key === "People") {
                return (
                  <p key={key}>
                    <strong>People with allergies:</strong>
                    {value.map((person, index) => {
                      if (person.name && person.allergies) {
                        return (
                          <span key={index} className="indent">
                            Name: {person.name}, Allergies: {person.allergies}
                          </span>
                        )
                      }
                    })}
                  </p>
                );
              }

              if (key === "Boats") {
                return (
                  <p key={key}>
                    <strong>Boats:</strong>
                    {value.map((boat, index) => {
                        return (
                          <span key={index} className="indent">
                            {boat.numberOf > 0 ? boat.numberOf : "0"}, {boat.rented ? "rented," : ""} {boat.type || "Unselecteds"}
                          </span>
                        )
                    })}
                  </p>
                );
              }

              if (key.includes("Time")) {
                const scheduleKey = key.replace("Time", "Schedule");
                if (data[scheduleKey].split(" ")[0] !== "Custom") {
                  return null;
                }
              }

              return (
                <p key={key}>
                  <strong>{key}:</strong> {String(value)}
                </p>
              );
            
            }
              
            )}
            <div className="button-group">
                <button className="back" onClick={onBack}>Back</button>
                <button className="next" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default Review;
