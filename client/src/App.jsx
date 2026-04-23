import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat.jsx";
import EcoBot from "./pages/EcoBot";
import Guide from "./pages/Guide";
import ZeroWaste from "./pages/ZeroWaste";
import EcoProducts from "./pages/EcoProducts";
import GreenHome from "./pages/GreenHome";
import SustainableTransport from "./pages/SustainableTransport";
import UrbanGardening from "./pages/UrbanGardening";
import EnergyConservation from "./pages/EnergyConservation";
import Layout from "./components/Layout";
import Resources from "./pages/Resources";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/ecobot" element={<EcoBot />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/guide/zero-waste" element={<ZeroWaste />} />
            <Route path="/products" element={<EcoProducts />} />
            <Route path="/guide/green-home" element={<GreenHome />} />
            <Route
              path="/guide/sustainable-transport"
              element={<SustainableTransport />}
            />
            <Route path="/guide/urban-gardening" element={<UrbanGardening />} />
            <Route
              path="/guide/energy-conservation"
              element={<EnergyConservation />}
            />
            <Route path="/resources" element={<Resources />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
