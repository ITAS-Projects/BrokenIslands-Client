import React from "react";
import "./assets/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout.js"
import NoPage from "./Components/NoPage.js"
import Home from "./Components/Home.js";
import TaxiList from "./Components/Taxis/TaxiList.js";
import NewTaxi from "./Components/Taxis/NewTaxi.js";
import EditTaxi from "./Components/Taxis/EditTaxi.js";
import TripList from "./Components/Trips/TripList.js";
import NewTrip from "./Components/Trips/NewTrip.js";
import EditTrip from "./Components/Trips/EditTrip.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/taxis" element={<TaxiList />} />
          <Route path="/taxis/new" element={<NewTaxi />} />
          <Route path="/taxis/edit/:id" element={<EditTaxi />} />
          <Route path="/trips" element={<TripList />} />
          <Route path="/trips/new" element={<NewTrip />} />
          <Route path="/trips/edit/:id" element={<EditTrip />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;