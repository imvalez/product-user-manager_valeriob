import React from 'react';
import UserList from '../components/users/UserList';
import './Pages.css';

const UsersPage = () => {
  return (
    <div className="users-page">
      <UserList />
    </div>
  );
};

export default UsersPage;