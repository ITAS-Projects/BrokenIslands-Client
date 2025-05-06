import React from "react";
import "./assets/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout.js"
import NoPage from "./Components/NoPage.js"
import Home from "./Components/Home.js";
import TaxiList from "./Components/TaxiList.js";
import NewTaxi from "./Components/NewTaxi.js";
import EditTaxi from "./Components/EditTaxi.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/taxis" element={<TaxiList />} />
          <Route path="/taxis/new" element={<NewTaxi />} />
          <Route path="/taxis/edit/:id" element={<EditTaxi />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;