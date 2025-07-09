import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const TwoFactorLogin = ({ onSuccess }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { verifyTwoFactor } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (!token) {
        throw new Error('Please enter your authentication code');
      }
      
      await verifyTwoFactor(token);
      if (onSuccess) onSuccess();
    } catch (error) {
      setError(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="two-factor-container">
      <h2>Two-Factor Authentication</h2>
      <p>Enter the 6-digit code from your authenticator app</p>
      
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
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
};

export default TwoFactorLogin;