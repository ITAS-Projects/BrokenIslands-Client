import React from "react";
import "./assets/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login.js";
import Secure from "./Components/Secure.js";

import Layout from "./Components/Layout.js"
import NoPage from "./Components/NoPage.js"
import Home from "./Components/Home.js";
import TaxiList from "./Components/Taxis/TaxiList.js";
import NewTaxi from "./Components/Taxis/NewTaxi.js";
import EditTaxi from "./Components/Taxis/EditTaxi.js";
import TripList from "./Components/Trips/TripList.js";
import NewTrip from "./Components/Trips/NewTrip.js";
import EditTrip from "./Components/Trips/EditTrip.js";
import BoatList from "./Components/Boats/BoatList.js";
import NewBoat from "./Components/Boats/NewBoat.js";
import EditBoat from "./Components/Boats/EditBoat.js";
import NewPerson from "./Components/People/NewPerson.js";
import PersonList from "./Components/People/PersonList.js";
import EditPerson from "./Components/People/EditPerson.js";
import GroupList from "./Components/Groups/GroupList.js";
import NewGroup from "./Components/Groups/NewGroup.js";
import Wizard from "./Components/Wizard/Wizard.js";
import ReservationList from "./Components/Reservations/ReservationList.js";
import QuickTaxi from "./Components/QuickView/QuickTaxi.js";
import Quick from "./Components/QuickView/Quick.js";
import QuickReservation from "./Components/QuickView/QuickReservation.js";
import QuickTrip from "./Components/QuickView/QuickTrip.js";
import QuickEditReservation from "./Components/QuickEdit/QuickEditReservation.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="/secure" element={<Secure />} />
          <Route index element={<Home />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/taxis" element={<TaxiList />} />
          <Route path="/taxis/new" element={<NewTaxi />} />
          <Route path="/taxis/edit/:id" element={<EditTaxi />} />
          <Route path="/trips" element={<TripList />} />
          <Route path="/trips/new" element={<NewTrip />} />
          <Route path="/trips/edit/:id" element={<EditTrip />} />
          <Route path="/boats" element={<BoatList />} />
          <Route path="/boats/new" element={<NewBoat />} />
          <Route path="/boats/edit/:id" element={<EditBoat />} />
          <Route path="/people" element={<PersonList />} />
          <Route path="/people/new" element={<NewPerson />} />
          <Route path="/people/edit/:id" element={<EditPerson />} />
          <Route path="/groups" element={<GroupList />} />
          <Route path="/groups/new" element={<NewGroup />} />
          <Route path="/reservations" element={<ReservationList />} />
          <Route path="/quick" element={<Quick />} />
          <Route path="/quick/taxi" element={<QuickTaxi />} />
          <Route path="/quick/reservation" element={<QuickReservation />} />
          <Route path="/quick/trip" element={<QuickTrip />} />
          <Route path="/quick/edit/reservation/:id" element={<QuickEditReservation />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;