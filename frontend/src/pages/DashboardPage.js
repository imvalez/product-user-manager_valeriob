import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

const DashboardPage = () => {
  const { currentUser, isAdmin } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Benvenuto, {currentUser.username}!</p>
      </div>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Gestione Prodotti</h3>
          <p>Visualizza, crea e modifica i prodotti.</p>
          <div className="card-actions">
            <Link to="/products" className="btn btn-primary">
              Visualizza Prodotti
            </Link>
            <Link to="/products/create" className="btn btn-secondary">
              Crea Prodotto
            </Link>
          </div>
        </div>
        
        {isAdmin && (
          <div className="dashboard-card">
            <h3>Gestione Utenti</h3>
            <p>Visualizza, crea e modifica gli utenti del sistema.</p>
            <div className="card-actions">
              <Link to="/users" className="btn btn-primary">
                Visualizza Utenti
              </Link>
              <Link to="/users/create" className="btn btn-secondary">
              Crea Utente
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;