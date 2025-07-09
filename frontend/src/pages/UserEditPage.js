import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserForm from '../components/users/UserForm';
import { getUserByIdApi, updateUserApi } from '../utils/api';
import './Pages.css';

const UserEditPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserByIdApi(id);
        setUser(data);
      } catch (err) {
        setError('Errore nel caricamento dell\'utente');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdateUser = async (userData) => {
    return await updateUserApi(id, userData);
  };

  if (loading) return <div className="loading">Caricamento utente...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="error">Utente non trovato</div>;

  return (
    <div className="user-edit-page">
      <UserForm user={user} onSubmit={handleUpdateUser} isEdit={true} />
    </div>
  );
};

export default UserEditPage;