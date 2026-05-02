import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, form);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed due to a server error.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-xl rounded-2xl w-96 border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-6 text-green-800 text-center">Sign Up</h2>

        {error && (
          <div className="mb-4 bg-red-100 p-3 rounded-lg text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <input type="text" placeholder="Name" className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={e => setForm({...form, name: e.target.value})} required />
        <input type="email" placeholder="Email" className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={e => setForm({...form, email: e.target.value})} required />
        <input type="password" placeholder="Password" className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={e => setForm({...form, password: e.target.value})} required />
          
        <button className="w-full bg-green-700 hover:bg-green-800 transition text-white p-3 rounded-lg font-bold text-lg">
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <span className="text-green-700 font-bold cursor-pointer" onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
