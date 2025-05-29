import React, { useState, useRef, useCallback, useEffect } from "react";

import format from "date-fns/format";
import { subDays, addDays, min } from "date-fns";

import CustomCalendar from "./CustomCalendar";
import axiosAuth from "../authRequest";

const backendURL = process.env.REACT_APP_API_BASE_URL;

const monthHeight = 560;

function QuickAllergy() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [viewType, setViewType] = useState(null);

  useEffect(() => {
    axiosAuth
      .get(`${backendURL}/reservations`)
      .then((response) => {
        response.data?.forEach((reservation) => {
        });
        setReservations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching taxis:", error);
        setLoading(false);
      });
  }, []);
  return (<>
  <h1>Allergies:</h1>
  {reservations.map(res => { return ( <p>{res.Group?.leader?.name}</p>)})}
  </>);
}

export default QuickAllergy;
