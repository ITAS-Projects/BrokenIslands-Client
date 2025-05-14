import { useEffect, useState } from "react";
import "../assets/Layout.css";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSession, useUser } from "@descope/react-sdk";

const Layout = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const { isAuthenticated } = useSession();
  const { user } = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }

    if (user) {
      setUserDetails(user);
    }
  }, [navigate]);

  return (
    <>
      {userDetails ? (
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
            <Link to="/logout">Logout</Link>
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
