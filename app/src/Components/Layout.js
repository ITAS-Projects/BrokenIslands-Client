import { useEffect, useState } from "react";
import "../assets/Layout.css";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Layout = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});

  const getUserDetails = async (accessToken) => {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
    );
    const data = await response.json();
    setUserDetails(data);
  };

  useEffect(() => {
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      navigate("/login");
    }

    getUserDetails(accessToken);
  }, [navigate]);

  return (
    <>
      {userDetails?.email ? (
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
      ) : (
      <div>
        <h1>Loading...</h1>
      </div>
      )}
    </>
  );
};

export default Layout;
