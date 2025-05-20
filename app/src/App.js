import React from "react";
import "./assets/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login.js";

import NoPage from "./Components/NoPage.js"
import Navbar from "./Components/Navbar.js";
import Home from "./Components/Home.js";
import TaxiList from "./Components/Taxis/TaxiList.js";
import NewTaxi from "./Components/Taxis/NewTaxi.js";
import EditTaxi from "./Components/Taxis/EditTaxi.js";
import Wizard from "./Components/Wizard/Wizard.js";
import QuickTaxi from "./Components/QuickView/QuickTaxi.js";
import Quick from "./Components/QuickView/Quick.js";
import QuickReservation from "./Components/QuickView/QuickReservation.js";
import QuickTrip from "./Components/QuickView/QuickTrip.js";
import QuickEditReservation from "./Components/QuickEdit/QuickEditReservation.js";
import UserManager from "./Components/ManageUsers/UserManager.js";
import { UserManagement } from "@descope/react-sdk";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/taxis" element={<TaxiList />} />
          <Route path="/taxis/new" element={<NewTaxi />} />
          <Route path="/taxis/edit/:id" element={<EditTaxi />} />
          <Route path="/users" element={<UserManager />} />
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