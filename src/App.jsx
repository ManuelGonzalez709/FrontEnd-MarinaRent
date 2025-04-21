import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";

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

  return (
    <>
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        {/* Si NO está autenticado, muestra Login. Si SÍ lo está, redirige a /home */}
        <Route
          path="/"
          element={
            !isAuthenticated ? <Login /> : <Navigate to="/home" replace />
          }
        />

        {/* Si está autenticado, muestra Home. Si NO, redirige a Login */}
        <Route
          path="/home"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/" replace />
          }
        />
      </Routes>

      {location.pathname !== "/" && <Footer />}
    </>
  );
}

export default App;
