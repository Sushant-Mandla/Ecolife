import React, { useState } from "react";
import axios from "axios";

const EcoTipSubscribe = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/subscribers/subscribe",
        { email }
      );

      setMessage(res.data.message);
      setEmail("");
    } catch (error) {
      setMessage("Subscription failed or already subscribed.");
    }
  };

  return (
    <div className="bg-green-700 text-white py-16 px-6 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Get Daily Eco Tips 🌿
      </h2>
      <p className="mb-6">
        Subscribe and receive daily sustainability tips in your inbox.
      </p>

      <form
        onSubmit={handleSubscribe}
        className="flex flex-col md:flex-row justify-center gap-4 max-w-xl mx-auto"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="p-3 rounded-lg text-black w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Subscribe
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default EcoTipSubscribe;