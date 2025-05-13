import React from "react";
import "../assets/Layout.css";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <header className="layout-header">
        <nav className="layout-nav">
          <Link to="/">
          <img
            src="/logo192.png"
            alt="Logo"
            className="layout-logo"
          /></Link>

          <ul className="layout-nav-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/quick">Quick View</Link></li>
            </ul>
            <ul className="layout-nav-list nav-list-2">
            <li><Link to="/taxis">Taxis</Link></li>
            <li><Link to="/trips">Trips</Link></li>
            <li><Link to="/boats">Boats</Link></li>
            <li><Link to="/people">People</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to="/reservations">Reservations</Link></li>
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
