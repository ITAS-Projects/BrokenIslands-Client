import React from "react";
import "./assets/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./assets/Wizard.css"

import Login from "./Components/Login.js";

import NoPage from "./Components/NoPage.js";
import Navbar from "./Components/Navbar.js";
import Home from "./Components/Home.js";
import TaxiList from "./Components/Taxis/TaxiList.js";
import NewTaxi from "./Components/Taxis/NewTaxi.js";
import EditTaxi from "./Components/Taxis/EditTaxi.js";
import Quick from "./Components/QuickView/Quick.js";
import QuickTaxi from "./Components/QuickView/QuickTaxi.js";
import QuickTrip from "./Components/QuickView/QuickTrip.js";
import QuickReservation from "./Components/QuickView/QuickReservation.js";
import QuickCreateReservation from "./Components/QuickCreate/QuickCreateReservation.js";
import QuickEditReservation from "./Components/QuickEdit/QuickEditReservation.js";
import UserManager from "./Components/ManageUsers/UserManager.js";
import CreateUser from "./Components/ManageUsers/CreateUser.js";
import EditUser from "./Components/ManageUsers/EditUser.js";
import QuickKitchen from "./Components/QuickView/QuickAllergy.js";
import QuickCreateTrip from "./Components/QuickCreate/QuickCreateTrip.js";
import QuickEditTrip from "./Components/QuickEdit/QuickEditTrip.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="/taxis" element={<TaxiList />} />
          <Route path="/taxis/new" element={<NewTaxi />} />
          <Route path="/taxis/edit/:id" element={<EditTaxi />} />
          <Route path="/users" element={<UserManager />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          
          <Route path="/quick" element={<Quick />} />
          <Route path="/quick/taxi" element={<QuickTaxi />} />
          <Route path="/quick/kitchen" element={<QuickKitchen />} />
          <Route path="/quick/reservation" element={<QuickReservation />} />
          <Route path="/quick/trip" element={<QuickTrip />} />
          <Route path="/quick/reservation/edit/:id" element={<QuickEditReservation />} />
          <Route path="/quick/reservation/new" element={<QuickCreateReservation />} />

          <Route path="/quick/trip/new" element={<QuickCreateTrip />} />
          <Route path="/quick/trip/edit/:id" element={<QuickEditTrip />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;