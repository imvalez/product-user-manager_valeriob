import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Users.css';

const UserItem = ({ user, onToggleStatus }) => {
  const { _id, username, isAdmin, isActive } = user;
  const { currentUser } = useAuth();
  
  // Previene che l'admin disattivi se stesso
  const isSelf = currentUser._id === _id;

  return (
    <div className="user-item">
      <span className="col-username">{username}</span>
      <span className="col-role">
        {isAdmin ? 'Amministratore' : 'Utente'}
      </span>
      <span className={`col-status ${isActive ? 'active' : 'inactive'}`}>
        {isActive ? 'Attivo' : 'Disattivato'}
      </span>
      <div className="col-actions">
        <Link to={`/users/edit/${_id}`} className="btn btn-sm btn-edit">
          Modifica
        </Link>
        <button
          onClick={() => onToggleStatus(_id)}
          className={`btn btn-sm ${isActive ? 'btn-deactivate' : 'btn-activate'}`}
          disabled={isSelf} // Non permettere di disattivare se stessi
          title={isSelf ? "Non puoi disattivare il tuo account" : ""}
        >
          {isActive ? 'Disattiva' : 'Attiva'}
        </button>
      </div>
    </div>
  );
};

export default UserItem;