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

          {/* Desktop-only navigation */}
          <ul className="navbar-nav-list desktop-only">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/quick">Quick View</Link></li>
          </ul>

          {/* Dropdown for all screen sizes */}
          <div className="navbar-dropdown" ref={dropdownRef}>
            <button
              className="navbar-dropdown-toggle"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <span className="desktop-only">Manage ▼</span>
              <span className="mobile-only">Menu ▼</span>
            </button>
            <ul className={`navbar-dropdown-menu ${dropdownOpen ? "open" : ""}`}>
              {/* Mobile-only links */}
              <li className="mobile-only"><Link to="/" onClick={() => setDropdownOpen(false)}>Home</Link></li>
              <li className="mobile-only"><Link to="/quick" onClick={() => setDropdownOpen(false)}>Quick View</Link></li>

              {/* Shared links */}
              <li><Link to="/taxis" onClick={() => setDropdownOpen(false)}>Taxis</Link></li>
              <li><Link to="/users" onClick={() => setDropdownOpen(false)}>Users</Link></li>

              {/* Mobile-only logout */}
              <li className="mobile-only">
                <button onClick={handleLogout} className="dropdown-logout-button">Logout</button>
              </li>
            </ul>
          </div>

          {/* Desktop-only user info and logout */}
          <span className="navbar-user-manage desktop-only">
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
        </nav>
      </header>

      <main className="navbar-main">
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;
