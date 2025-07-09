import React from 'react';
import UserForm from '../components/users/UserForm';
import { createUserApi } from '../utils/api';
import './Pages.css';

const UserCreatePage = () => {
  const handleCreateUser = async (userData) => {
    return await createUserApi(userData);
  };

  return (
    <div className="user-create-page">
      <UserForm onSubmit={handleCreateUser} />
    </div>
  );
};

export default UserCreatePage;