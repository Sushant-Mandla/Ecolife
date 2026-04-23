import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  return (
    <nav className="bg-green-700 text-white px-8 py-4 flex justify-between items-center">
      
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold flex items-center gap-2">
        🌱 Ecolife
      </Link>

      {/* Menu */}
      <ul className="hidden md:flex gap-6 font-medium items-center">
        <li>
          <Link to="/" className="hover:text-green-200">Home</Link>
        </li>

        <li>
          <Link to="/resources" className="hover:text-green-200">Resources</Link>
        </li>

        <li>
          <Link to="/guide" className="hover:text-green-200">Guide</Link>
        </li>
 

        <li>
          <Link to="/ecobot" className="hover:text-green-200">EcoBot</Link>
        </li>

        <li>
          <Link to="/chat" className="hover:text-green-200">Chat</Link>
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
              <Link to="/login" className="hover:text-green-200">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="bg-white text-green-700 px-3 py-1 rounded hover:bg-green-100">
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
