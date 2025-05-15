import React from "react";
import axiosAuth from "../authRequest";

const backendURL = process.env.REACT_APP_API_BASE_URL;

function Review({ data, onBack }) {

  const handleSubmit = async () => {
    // Prepare payload to send to the backend
    const payload = {
      arrivalDay: data.ArrivalDay,
      departureDay: data.DepartureDay,
      arrivalSchedule: data.ArrivalSchedule,
      departureSchedule: data.DepartureSchedule,
      arrivalTime: data.ArrivalSchedule.startsWith("Custom") ? data.ArrivalTime : undefined,
      departureTime: data.DepartureSchedule.startsWith("Custom") ? data.DepartureTime : undefined,
      numberOfPeople: data.NumberOfPeople,
      people: data.People.map(p => ({
        name: p.name,
        allergies: p.allergies || ""
      })),
      boats: data.Boats.map(b => ({
        type: b.type,
        numberOf: Number(b.numberOf),
        rented: b.rented
      }))
    };

    try {
      // Send the data to the backend for validation and creation
      const response = await axiosAuth.post(`${backendURL}/quick`, payload);

      // Handle success - inform the user and redirect
      alert("Reservation created successfully. Redirecting...");
      window.location.href = '/quick';
    } catch (error) {
      // Handle error - show the error message from the backend
      console.error("Error creating reservation:", error);
      // show error message, or default error if missing
      alert(error.response?.data?.error || "An error occurred while creating the reservation. Please try again.");
    }
  };

  return (
    <div>
      <h2>Step 4: Review</h2>
      <p>
        <strong>Reservation Name:</strong> {data.People[0].name}
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
