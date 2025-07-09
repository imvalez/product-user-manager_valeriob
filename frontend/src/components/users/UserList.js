import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsersApi, toggleUserStatusApi } from '../../utils/api';
import UserItem from './UserItem';
import './Users.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersApi();
      setUsers(data);
    } catch (err) {
      setError('Errore nel caricamento degli utenti');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatusApi(id);
      // Update the users list
      fetchUsers();
    } catch (err) {
      setError('Errore nella modifica dello stato dell\'utente');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Caricamento utenti...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>Lista Utenti</h2>
        <Link to="/users/create" className="btn btn-primary">
          Nuovo Utente
        </Link>
      </div>
      
      {users.length === 0 ? (
        <p>Nessun utente disponibile.</p>
      ) : (
        <div className="user-list">
          <div className="user-list-header-row">
            <span className="col-username">Username</span>
            <span className="col-role">Ruolo</span>
            <span className="col-status">Stato</span>
            <span className="col-actions">Azioni</span>
          </div>
          {users.map(user => (
            <UserItem
              key={user._id}
              user={user}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;