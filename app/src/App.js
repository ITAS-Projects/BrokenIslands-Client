import React from "react";
import "./assets/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout.js"
import NoPage from "./Components/NoPage.js"
import Users from "./Components/Users.js"
import Schedule from "./Components/Schedule.js"
import Home from "./Components/Home.js";
import EditPerson from "./Components/EditPerson.js";
import PeopleList from "./Components/PeopleList.js";
import NewPerson from "./Components/NewPerson.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="schedule" element={<Schedule />} />
          <Route exact path="data" element={<PeopleList />} />
          <Route path="data/edit/:id" element={<EditPerson />} />
          <Route path="data/new" element={<NewPerson />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;