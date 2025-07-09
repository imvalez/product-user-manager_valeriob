import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const TwoFactorDisable = ({ onSuccess }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { disableTwoFactor } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (!token) {
        throw new Error('Please enter your authentication code');
      }
      
      await disableTwoFactor(token);
      if (onSuccess) onSuccess();
    } catch (error) {
      setError(error.message || 'Failed to disable two-factor authentication');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="two-factor-disable-container">
      <h2>Disable Two-Factor Authentication</h2>
      <p>To disable two-factor authentication, please enter the 6-digit code from your authenticator app or one of your backup codes.</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Authentication code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            maxLength={6}
            autoFocus
            className="form-control"
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Disable Two-Factor Authentication'}
        </button>
      </form>
    </div>
  );
};

export default TwoFactorDisable;