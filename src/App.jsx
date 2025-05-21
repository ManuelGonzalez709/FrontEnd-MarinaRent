import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Informativos from './pages/Informativos';
import Alquilables from './pages/Alquilables';
import Mostrador from './pages/Mostrador';
import Carrito from './pages/Carrito';
import NotFound from './pages/NotFound';
import Reservas from './pages/Reservas';
import Perfil from './pages/Perfil';
import Admin from './pages/Admin';
import Registro from './pages/Register';
import RecuperarPassword from './pages/ResetPass';
import { API_URL } from './utilities/apirest';
import axios from 'axios';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("authToken");
  const [cart, setCart] = useState([]);
  const [admin, setAdmin] = useState();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Carrito actualizado:", cart);
    }
  }, [cart]); // Se activa cada vez que el carrito cambia

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token != null) {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      axios.get(API_URL + "api/isAdmin", { headers })
        .then((response) => {
          console.log(response)
          if (response.status === 200)
            setAdmin(response.data.is_admin)
          else setAdmin(false)
        })
        .catch((error) => {
          console.error("Error al cargar los informativos:", error);
          setAdmin(false)
        })
    }
  }, [isAuthenticated])

  return (
    <>
      {location.pathname !== "/" && location.pathname !== "/registro" && location.pathname !== "/recuperar" && <Navbar admin={admin} />}

      <Routes>

        <Route
          path="/"
          element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/registro"
          element={!isAuthenticated ? <Registro /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/recuperar"
          element={!isAuthenticated ? <RecuperarPassword /> : <Navigate to="/home" replace />}
        />

        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/" replace />}
        />
        <Route
          path="/notFound"
          element={isAuthenticated ? <NotFound /> : <Navigate to="/" replace />}
        />
        <Route
          path="/informativos"
          element={isAuthenticated ? <Informativos /> : <Navigate to="/" replace />}
        />
        <Route
          path="/alquilables"
          element={isAuthenticated ? <Alquilables /> : <Navigate to="/" replace />}
        />
        <Route
          path="/mostrador"
          element={isAuthenticated ? <Mostrador cart={cart} setCart={setCart} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/carrito"
          element={isAuthenticated ? <Carrito cart={cart} setCart={setCart} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/reservas"
          element={isAuthenticated ? <Reservas cart={cart} setCart={setCart} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/perfil"
          element={isAuthenticated ? <Perfil /> : <Navigate to="/" replace />}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated
              ? admin === undefined
                ? <div className="flex justify-center items-center"><div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div></div>
                : admin ? <Admin /> : <Navigate to="/" replace />
              : <Navigate to="/" replace />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {location.pathname !== "/" && location.pathname !== "/registro" && location.pathname !== "/recuperar" && <Footer />}
    </>
  );
}

export default App;
