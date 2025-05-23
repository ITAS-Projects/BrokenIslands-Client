import { useEffect, useState, useRef } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSession, useUser, useDescope } from "@descope/react-sdk";
import "../assets/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { isAuthenticated, isSessionLoading } = useSession();
  const { user, isUserLoading } = useUser();
  const { logout } = useDescope();

  useEffect(() => {
    if (isSessionLoading || isUserLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setUserDetails(user);
    }
  }, [isSessionLoading, isUserLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isSessionLoading || isUserLoading) {
    return <div><h1>Loading...</h1></div>;
  }

  if (!userDetails) {
    return (
      <div>
        <h1>Something went wrong. Please refresh or log in again.</h1>
      </div>
    );
  }

  return (
    <>
      <header className="navbar-header">
        <nav className="navbar-nav">
          <Link to="/">
            <img src="/logo192.png" alt="Logo" className="navbar-logo" />
          </Link>

          <ul className="navbar-nav-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/quick">Quick View</Link></li>
          </ul>

          <div className="navbar-dropdown" ref={dropdownRef}>
            <button
              className="navbar-dropdown-toggle"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              Manage ▼
            </button>
            <ul className={`navbar-dropdown-menu ${dropdownOpen ? "open" : ""}`}>
              <li><Link to="/taxis" onClick={() => setDropdownOpen(false)}>Taxis</Link></li>
              <li><Link to="/users" onClick={() => setDropdownOpen(false)}>Users</Link></li>
            </ul>
          </div>
        </nav>

        <span className="navbar-user-manage">
          <img
            className="navbar-profile-pic"
            src={userDetails.picture || "/225-default-avatar.png"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/225-default-avatar.png";
            }}
            alt={`${userDetails.givenName || "User"}'s profile`}
          />
          <button onClick={handleLogout}>Logout</button>
        </span>
      </header>

      <main className="navbar-main">
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;
