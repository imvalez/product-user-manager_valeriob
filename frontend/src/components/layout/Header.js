import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const history = useNavigate();

  const handleLogout = () => {
    logout();
    history("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Gestionale Prodotti</Link>
      </div>
      <nav className="nav">
        {isAuthenticated ? (
          <>
            <span className="welcome-text">
              Benvenuto, {currentUser.username}{" "}
              {currentUser.isAdmin && "(Admin)"}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Registrazione
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
