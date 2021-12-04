import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import "./navbar.css";

const Navbar = () => {
  const { authValues, clearAuthValues } = useContext(AuthContext);
  const authToken = authValues.token;

  return (
    <header className="header">
      <div className="header-brand">
        <Link to="/" className="header-brand-link">
          BlaBlaEvent
        </Link>
      </div>
      <nav className="header-nav">
        {!authToken && (
          <NavLink to="/auth" className="nav-link">
            Sign In
          </NavLink>
        )}
        <NavLink to="/events" className="nav-link">
          Events
        </NavLink>
        {authToken && (
          <>
            <NavLink to="/bookings" className="nav-link">
              Bookings
            </NavLink>
            <button className="sign-out-btn" onClick={clearAuthValues}>
              Sign Out
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
