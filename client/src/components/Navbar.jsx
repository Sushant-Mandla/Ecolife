import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-green-700 text-white px-4 md:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2" onClick={closeMenu}>
          🌱 Ecolife
        </Link>

        {/* Desktop Menu */}
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-green-600"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <ul className="mt-4 space-y-4 font-medium">
          <li>
            <NavLink to="/" end className={navItemClass} onClick={closeMenu}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/resources" className={navItemClass} onClick={closeMenu}>Resources</NavLink>
          </li>
          <li>
            <NavLink to="/guide" className={navItemClass} onClick={closeMenu}>Guide</NavLink>
          </li>
          <li>
            <NavLink to="/ecobot" className={navItemClass} onClick={closeMenu}>EcoBot</NavLink>
          </li>
          <li>
            <NavLink to="/chat" className={navItemClass} onClick={closeMenu}>Chat</NavLink>
          </li>

          {user ? (
            <>
              <li className="text-green-200">
                Logged in as <span className="font-semibold">{user.name}</span>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="bg-white text-green-700 px-3 py-2 rounded hover:bg-green-100"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={authNavItemClass} onClick={closeMenu}>Login</NavLink>
              </li>
              <li>
                <NavLink to="/signup" className={signupClass} onClick={closeMenu}>Signup</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
