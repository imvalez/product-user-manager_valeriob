import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TwoFactorSetup from '../components/auth/TwoFactorSetup';
import TwoFactorDisable from '../components/auth/TwoFactorDisable';

const SecuritySettingsPage = () => {
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  
  const { currentUser } = useAuth();
  
  const handleSetupComplete = () => {
    setShowSetup(false);
  };
  
  const handleDisableComplete = () => {
    setShowDisable(false);
  };
  
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="security-settings-container">
      <h2>Security Settings</h2>
      
      <div className="card">
        <div className="card-header">
          <h3>Two-Factor Authentication</h3>
        </div>
        
        <div className="card-body">
          {currentUser.twoFactorEnabled ? (
            <>
              <div className="status-enabled">
                <span className="status-icon">✓</span>
                <span>Two-factor authentication is enabled</span>
              </div>
              
              {!showDisable ? (
                <button 
                  className="btn btn-danger"
                  onClick={() => setShowDisable(true)}
                >
                  Disable Two-Factor Authentication
                </button>
              ) : (
                <TwoFactorDisable onSuccess={handleDisableComplete} />
              )}
            </>
          ) : (
            <>
              <div className="status-disabled">
                <span className="status-icon">✗</span>
                <span>Two-factor authentication is not enabled</span>
              </div>
              
              <p>
                Two-factor authentication adds an extra layer of security to your account.
                When enabled, you'll need to provide a code from your authenticator app in addition 
                to your password when logging in.
              </p>
              
              {!showSetup ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowSetup(true)}
                >
                  Enable Two-Factor Authentication
                </button>
              ) : (
                <TwoFactorSetup onSuccess={handleSetupComplete} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;