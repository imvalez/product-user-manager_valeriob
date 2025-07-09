import React from "react";
import { Navigate } from "react-router-dom";
import Register from "../components/auth/Register";
import { useAuth } from "../context/AuthContext";
import "./Pages.css";

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="auth-page">
      <Register />
    </div>
  );
};

export default RegisterPage;
