import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Pages.css";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to dashboard if already logged in
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Benvenuto nel Gestionale Prodotti</h1>
        <p>Sistema completo per la gestione dei prodotti e degli utenti</p>
        <div className="hero-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Accedi
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/register")}
          >
            Registrati
          </button>
        </div>
      </div>
      <div className="features-section">
        <h2>Funzionalità</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Gestione Prodotti</h3>
            <p>
              Crea, modifica e gestisci i tuoi prodotti in modo semplice ed
              efficiente.
            </p>
          </div>
          <div className="feature-card">
            <h3>Area Amministrativa</h3>
            <p>
              Gestione completa degli utenti con controllo delle autorizzazioni.
            </p>
          </div>
          <div className="feature-card">
            <h3>Interfaccia Intuitiva</h3>
            <p>Design moderno e facile da usare per una esperienza ottimale.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
