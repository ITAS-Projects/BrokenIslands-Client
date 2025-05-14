import React from "react";
import axiosAuth from "../../modules/authRequest";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function Review({ data, onBack }) {

  const compareTimes = (t1, t2) => {
    const [h1, m1] = t1.split(':').slice(0, 2).map(Number);
    const [h2, m2] = t2.split(':').slice(0, 2).map(Number);
  
    if (h1 !== h2) return h1 - h2;
    return m1 - m2;
  };
  

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

    if (data.ArrivalSchedule.split(" ")[0] === "Custom") {arrivalCustom = true}
    if (data.DepartureSchedule.split(" ")[0] === "Custom") {departureCustom = true}
    if (arrivalCustom && data.ArrivalTime === "") {alert('The Arrival time doesnt exist');return null}
    if (departureCustom && data.DepartureTime === "") {alert('The Departure time doesnt exist');return null}

    if (data.NumberOfPeople < 1) {alert('The Number of people needs a number greater than 1');return null}
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

    let numOfBoats = 0;
    for (let boat of data.Boats) {
      numOfBoats += Number(boat.numberOf);
      if (boat.type === "") {alert('There is a group of boats without a type');return null}
      if ((boat.numberOf || 0) <= 0) {alert('There is a group of boats with less than one boat in it');return null}
    }  


    Promise.all([
      Promise.all(
        data.People.map(person =>
          axiosAuth.post(`${backendURL}/people`, {
            name: person.name,
            allergies: person.allergies
          }).then(response => response.data)
        )
      ),
      
      axiosAuth.get(`${backendURL}/taxis`)
      .then((response) => response.data),

      axiosAuth.get(`${backendURL}/trips`)
        .then((response) => response.data)
    ])
    .then(([PeopleData, Taxis, Trips]) => {
      console.log("Created people, found taxis, and looked for trips");

      let leastSpace = 0;
      let usedTaxiId = null;
      let MostSpace = 0;
      let BackupTaxiId = null;
      for (let taxi of Taxis) {
        if (taxi.spaceForKayaks >= numOfBoats && (taxi.spaceForKayaks < leastSpace || leastSpace === 0) && taxi.spaceForPeople >= data.NumberOfPeople) {
          leastSpace = taxi.spaceForKayaks;
          usedTaxiId = taxi.id;
        } else if (leastSpace === 0 && taxi.spaceForKayaks > MostSpace) {
          MostSpace = taxi.spaceForKayaks;
          BackupTaxiId = taxi.id;
        }
      }

      let arrivalTrip = null;
      let departureTrip = null;
      for (let trip of Trips) {
        if (trip.timeFrame === data.ArrivalSchedule) {
          if (trip.day.split('T')[0] === data.ArrivalDay.split('T')[0]) {
            if (arrivalCustom) {
              if (compareTimes(data.ArrivalTime, trip.timeStart) === 0) {
              arrivalTrip = trip.id;
              }
            } else {
              arrivalTrip = trip.id;
            }
          }
        } else if (trip.timeFrame === data.DepartureSchedule) {
          if (trip.day.split('T')[0] === data.DepartureDay.split('T')[0]) {
            if (departureCustom) {
              if (compareTimes(data.DepartureTime, trip.timeStart) === 0) {
                departureTrip = trip.id;
                }
            } else {
              departureTrip = trip.id;
            }
          }
        }
      }

      let leaderId = null;
      let PeopleIds = PeopleData.map(personData => {
        if (personData.name === data.People?.[0]?.name) {
          leaderId = personData.id;
        }
        return personData.id;
      })
      if (leaderId === null) {alert("Created person wasnt created?"); return null}
      let TaxiIdForTrips;
      if (leastSpace === 0) {
        TaxiIdForTrips = BackupTaxiId;
      } else {
        TaxiIdForTrips = usedTaxiId;
      }

      let arrivalData = {
        day: data.ArrivalDay,
        timeFrame: data.ArrivalSchedule,
        TaxiId: TaxiIdForTrips,
      }

      if (arrivalCustom) {
        arrivalData.timeStart = data.ArrivalTime;
      }

      let departureData = {
        day: data.DepartureDay,
        timeFrame: data.DepartureSchedule,
        TaxiId: TaxiIdForTrips,
      }

      if (departureCustom) {
        departureData.timeStart = data.DepartureTime;
      }

      Promise.all([
        arrivalTrip !== null 
          ? Promise.resolve(arrivalTrip) 
          : axiosAuth.post(`${backendURL}/trips`, arrivalData)
          .then(response => response.data.id),

        departureTrip !== null 
          ? Promise.resolve(departureTrip) 
          : axiosAuth.post(`${backendURL}/trips`, departureData)
          .then(response => response.data.id),

        axiosAuth.post(`${backendURL}/groups`, {
            seperatePeople: false,
            numberOfPeople: data.NumberOfPeople,
            PersonIds: PeopleIds,
            GroupLeader: leaderId
          }).then(response => response.data.id)
      ])
      .then(([arrivalId, departureId, groupId]) => {
        console.log("Created arrival, departure and group");
        console.log(`Arrivel: ${arrivalId}, Departure: ${departureId}`);
        axiosAuth.post(`${backendURL}/reservations`, {
          TripIds: [arrivalId, departureId],
          GroupId: groupId
        })
        .then(response => response.data.id)
        .then(reservationId => {
          console.log("Created Reservation");
          Promise.all(
            data.Boats.map(boat =>
              axiosAuth.post(`${backendURL}/boats`, {
                type: boat.type,
                numberOf: boat.numberOf,
                isRented: boat.rented,
                ReservationId: reservationId
              }).then(response => response.data.id)
            )
          ).then(response => {
            console.log("Created Boats");
            console.log("All data created");
            alert("The full reservation was created sucessfully, redirecting...");
            window.location.href = '/quick';
          })
        })
      });

    })    
    .catch(error => {
        console.error('Error adding people:', error);
        alert('There was an error while adding data. Please try again.');
    });

    
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
                      return null;
                    })}
                    <br />
                    <strong>Other People:</strong>
                    {value.map((person, index) => {
                      if (person.name && !person.allergies) {
                        return (
                          <span key={index} className="indent">
                            Name: {person.name}
                          </span>
                        )
                      }
                      return null;
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
                            {boat.numberOf > 0 ? boat.numberOf : "0"}, {boat.rented ? "rented" : "personal"}, {boat.type || "Unselecteds"}
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
