import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return (
    <aside className="sidebar">
      <ul className="menu">
        <li className={location.pathname === '/dashboard' ? 'active' : ''}>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li className={location.pathname === '/products' ? 'active' : ''}>
          <NavLink to="/products">Prodotti</NavLink>
        </li>
        <li className={location.pathname === '/products/create' ? 'active' : ''}>
          <NavLink to="/products/create">Crea Prodotto</NavLink>
        </li>
        {isAdmin && (
          <>
            <li className="admin-section">
              <span>Amministrazione</span>
            </li>
            <li className={location.pathname === '/users' ? 'active' : ''}>
              <NavLink to="/users">Utenti</NavLink>
            </li>
            <li className={location.pathname === '/users/create' ? 'active' : ''}>
              <NavLink to="/users/create">Crea Utente</NavLink>
            </li>
          </>
        )}
        <li className="sidebar-section">Impostazioni</li>
        <li className={location.pathname === '/settings/security' ? 'active' : ''}>
          <NavLink to="/settings/security">Sicurezza</NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;