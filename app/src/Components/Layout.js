import React from "react";
import "../assets/Layout.css";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <header className="layout-header">
        <nav className="layout-nav">
          <img
            src="/logo192.png"
            alt="Logo"
            className="layout-logo"
          />

          <ul className="layout-nav-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/taxis">Taxis</Link></li>
            <li><Link to="/trips">Trips</Link></li>
            <li><Link to="/boats">Boats</Link></li>
          </ul>
        </nav>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
