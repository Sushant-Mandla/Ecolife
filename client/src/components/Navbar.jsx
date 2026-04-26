import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const navItemClass = ({ isActive }) =>
    `transition ${isActive ? "text-white underline underline-offset-8 decoration-2" : "hover:text-green-200"}`;

  const authNavItemClass = ({ isActive }) =>
    `transition ${isActive ? "text-white font-semibold underline underline-offset-8 decoration-2" : "hover:text-green-200"}`;

  const signupClass = ({ isActive }) =>
    `px-3 py-1 rounded transition ${
      isActive
        ? "bg-green-100 text-green-900 font-semibold"
        : "bg-white text-green-700 hover:bg-green-100"
    }`;

  return (
    <nav className="bg-green-700 text-white px-8 py-4 flex justify-between items-center">
      
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold flex items-center gap-2">
        🌱 Ecolife
      </Link>

      {/* Menu */}
      <ul className="hidden md:flex gap-6 font-medium items-center">
        <li>
          <NavLink to="/" end className={navItemClass}>Home</NavLink>
        </li>

        <li>
          <NavLink to="/resources" className={navItemClass}>Resources</NavLink>
        </li>

        <li>
          <NavLink to="/guide" className={navItemClass}>Guide</NavLink>
        </li>
 

        <li>
          <NavLink to="/ecobot" className={navItemClass}>EcoBot</NavLink>
        </li>

        <li>
          <NavLink to="/chat" className={navItemClass}>Chat</NavLink>
        </li>
       

        {/* Authentication Section */}
        {user ? (
          <>
            <li className="text-green-200">
              Logged in as <span className="font-semibold">{user.name}</span>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-white text-green-700 px-3 py-1 rounded hover:bg-green-100"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" className={authNavItemClass}>Login</NavLink>
            </li>
            <li>
              <NavLink to="/signup" className={signupClass}>Signup</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
