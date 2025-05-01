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
  
  
  return (
    <>
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />}
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
        <Route path="*" element={<NotFound />} />
      </Routes>

      {location.pathname !== "/" && <Footer />}
    </>
  );
}

export default App;
