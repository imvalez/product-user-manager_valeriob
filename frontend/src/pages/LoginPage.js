import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TwoFactorLogin from "../components/auth/TwoFactorLogin";
import "./Pages.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { isAuthenticated, login, requireTwoFactor } = useAuth();
  const navigate = useNavigate();
  
  // Se l'utente è già autenticato, reindirizza al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await login(username, password);
      
      // Se la 2FA è richiesta, il flusso mostrerà il componente TwoFactorLogin
      if (!result?.requireTwoFactor) {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  
  const handleTwoFactorSuccess = () => {
    navigate("/dashboard");
  };
  
  // Se è richiesta la verifica a due fattori, mostra il relativo form
  if (requireTwoFactor) {
    return <TwoFactorLogin onSuccess={handleTwoFactorSuccess} />;
  }
  
  return (
    <div className="auth-page">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
