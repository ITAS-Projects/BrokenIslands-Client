import React from "react";
import "./assets/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout.js"
import NoPage from "./Components/NoPage.js"
import SchedulesList from "./Components/SchedulesList.jsx";
import Home from "./Components/Home.js";
import EditPerson from "./Components/EditPerson.jsx";
import EditSchedule from "./Components/EditSchedule.jsx";
import PeopleList from "./Components/PeopleList.jsx";
import AddPerson from "./Components/AddPerson.jsx";
import AddSchedule from "./Components/AddSchedule.jsx";
import TripsList from "./Components/TripsList.jsx";
import AddTrip from "./Components/AddTrip.jsx";
import EditTrip from "./Components/EditTrip.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route exact path="users" element={<PeopleList />} />
          <Route path="users/new" element={<AddPerson />} />
          <Route path="users/edit/:id" element={<EditPerson />} />
          <Route exact path="schedule" element={<SchedulesList />} />
          <Route path="schedule/new" element={<AddSchedule />} />
          <Route path="schedule/edit/:id" element={<EditSchedule />} />
          <Route exact path="trips" element={<TripsList />} />
          <Route path="trips/new" element={<AddTrip />} />
          <Route path="trips/edit/:id" element={<EditTrip />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;