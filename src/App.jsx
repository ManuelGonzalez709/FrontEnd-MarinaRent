import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Informativos from './pages/Informativos';

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
        <Route
          path="/"
          element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/" replace />}
        />
        <Route
          path="/informativos"
          element={ isAuthenticated ? <Informativos /> : <Navigate to="/" replace />}
        />
      </Routes>
      {location.pathname !== "/" && <Footer />}
    </>
  );
}

export default App;
