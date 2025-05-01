import React from "react";
import "./assets/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout.js"
import NoPage from "./Components/NoPage.js"
import Users from "./Components/Users.js"
import Schedule from "./Components/Schedule.js"
import Home from "./Components/Home.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;