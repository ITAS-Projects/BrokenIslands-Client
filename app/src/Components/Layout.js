import { useEffect, useState } from "react";
import "../assets/Layout.css";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSession, useUser, useDescope } from "@descope/react-sdk";

const Layout = () => {
  const navigate = useNavigate();
  const [ userDetails, setUserDetails ] = useState(null);
  const { isAuthenticated, isSessionLoading } = useSession();
  const { user, isUserLoading } = useUser();
  const { logout } = useDescope();

  useEffect(() => {
    if (isSessionLoading || isUserLoading) {
      return; // Wait until both loading flags are false
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setUserDetails(user);
    }
  }, [isSessionLoading, isUserLoading, isAuthenticated, user, navigate]);


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
        <span className="User-Manage">
          <img
          src={userDetails.picture}
          alt={`${userDetails.given_name}'s profile`}
          className="profile-pic"
          ></img>
            <button onClick={() => {logout(); navigate("/login");}}>Logout</button>
            </span>
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
