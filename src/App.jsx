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
import CohereChat from './pages/ai';
import RecuperarPassword from './pages/ResetPass';
import { API_URL } from './utilities/apirest';
import axios from 'axios';

/**
 * Componente principal de la aplicación.
 * Configura el router, la autenticación, el carrito y la lógica de rutas protegidas.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

/**
 * Componente que contiene la lógica de rutas y estado global.
 * Maneja autenticación, rutas protegidas, estado de admin y carrito.
 * @returns {JSX.Element}
 */
function AppContent() {
  const location = useLocation();
  // Determina si el usuario está autenticado
  const isAuthenticated = localStorage.getItem("authToken");
  // Estado del carrito de compras
  const [cart, setCart] = useState([]);
  // Estado para saber si el usuario es admin
  const [admin, setAdmin] = useState();

  /**
   * Carga el carrito desde localStorage al montar el componente.
   */
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  /**
   * Guarda el carrito en localStorage cada vez que cambia.
   */
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Carrito actualizado:", cart);
    }
  }, [cart]); // Se activa cada vez que el carrito cambia

  /**
   * Comprueba si el usuario autenticado es admin.
   * Actualiza el estado 'admin' según la respuesta de la API.
   */
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
      {/* Navbar solo si no estamos en login, registro o recuperar */}
      {location.pathname !== "/" && location.pathname !== "/registro" && location.pathname !== "/recuperar" && <Navbar admin={admin} />}

      <Routes>
        {/* Ruta de login */}
        <Route
          path="/"
          element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />}
        />
        {/* Ruta de registro */}
        <Route
          path="/registro"
          element={!isAuthenticated ? <Registro /> : <Navigate to="/home" replace />}
        />
        {/* Ruta de recuperación de contraseña */}
        <Route
          path="/recuperar"
          element={!isAuthenticated ? <RecuperarPassword /> : <Navigate to="/home" replace />}
        />
        {/* Ruta principal (home) */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/" replace />}
        />
        {/* Ruta de página no encontrada */}
        <Route
          path="/notFound"
          element={isAuthenticated ? <NotFound /> : <Navigate to="/" replace />}
        />
        {/* Ruta de informativos */}
        <Route
          path="/informativos"
          element={isAuthenticated ? <Informativos /> : <Navigate to="/" replace />}
        />
        {/* Ruta de productos alquilables */}
        <Route
          path="/alquilables"
          element={isAuthenticated ? <Alquilables /> : <Navigate to="/" replace />}
        />
        {/* Ruta de mostrador, requiere autenticación y pasa el carrito */}
        <Route
          path="/mostrador"
          element={isAuthenticated ? <Mostrador cart={cart} setCart={setCart} /> : <Navigate to="/" replace />}
        />
        {/* Ruta del carrito */}
        <Route
          path="/carrito"
          element={isAuthenticated ? <Carrito cart={cart} setCart={setCart} /> : <Navigate to="/" replace />}
        />
        {/* Ruta de reservas */}
        <Route
          path="/reservas"
          element={isAuthenticated ? <Reservas cart={cart} setCart={setCart} /> : <Navigate to="/" replace />}
        />
        {/* Ruta de perfil */}
        <Route
          path="/perfil"
          element={isAuthenticated ? <Perfil /> : <Navigate to="/" replace />}
        />
        {/* Ruta de chat IA */}
        <Route
          path="/iacohere"
          element={isAuthenticated ? <CohereChat /> : <Navigate to="/" replace />}
        />
        {/* Ruta de administración, solo para admins */}
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
        {/* Ruta para cualquier otra url no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer solo si no estamos en login, registro o recuperar */}
      {location.pathname !== "/" && location.pathname !== "/registro" && location.pathname !== "/recuperar" && <Footer />}
    </>
  );
}

export default App;
