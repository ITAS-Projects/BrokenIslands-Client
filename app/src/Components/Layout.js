import React from "react";
import "../assets/Layout.css";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <header className="layout-header">
        <nav className="layout-nav">
          {/* Logo on the left */}
          <img
            src="/logo192.png"
            alt="Logo"
            className="layout-logo"
          />

          {/* Navigation links */}
          <ul className="layout-nav-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/schedule">Schedule</Link></li>
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
