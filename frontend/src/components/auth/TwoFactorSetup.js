import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const TwoFactorSetup = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);
  
  const { setupTwoFactor, enableTwoFactor, twoFactorSetup } = useAuth();
  
  const handleSetup = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      await setupTwoFactor();
    } catch (error) {
      setError('Failed to setup two-factor authentication: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [setupTwoFactor]);

  useEffect(() => {
    if (!twoFactorSetup) {
      handleSetup();
    }
  }, [twoFactorSetup, handleSetup]);
  
  const handleEnable = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!verificationCode) {
        throw new Error('Please enter the verification code');
      }
      
      await enableTwoFactor(verificationCode);
      setSetupComplete(true);
    } catch (error) {
      setError(error.message || 'Failed to enable two-factor authentication');
    } finally {
      setLoading(false);
    }
  };
  
  if (setupComplete) {
    return (
      <div className="success-container">
        <h2>Setup Complete!</h2>
        <p>Two-factor authentication has been successfully enabled for your account.</p>
        <p>Make sure to save your backup codes in a safe place. You will need them if you lose access to your authenticator app.</p>
      </div>
    );
  }
  
  if (loading && !twoFactorSetup) {
    return <div>Loading...</div>;
  }
  
  if (!twoFactorSetup) {
    return (
      <div className="error-container">
        <h2>Setup Failed</h2>
        <p>{error || 'Failed to initialize two-factor authentication setup.'}</p>
        <button onClick={handleSetup} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="two-factor-setup-container">
      <h2>Setup Two-Factor Authentication</h2>
      
      <div className="setup-steps">
        <div className="step">
          <h3>Step 1: Scan QR Code</h3>
          <p>Use an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator to scan the QR code below:</p>
          
          <div className="qr-code-container">
            {twoFactorSetup.qrCode && (
              <img src={twoFactorSetup.qrCode} alt="QR Code for two-factor authentication" />
            )}
          </div>
          
          <p>Can't scan the QR code? Use this code instead:</p>
          <div className="secret-key">{twoFactorSetup.secret}</div>
        </div>
        
        <div className="step">
          <h3>Step 2: Backup Codes</h3>
          <p>Save these backup codes in a safe place. You can use them to log in if you lose access to your authenticator app:</p>
          
          <div className="backup-codes">
            {twoFactorSetup.backupCodes && twoFactorSetup.backupCodes.map((code, index) => (
              <div key={index} className="backup-code">{code}</div>
            ))}
          </div>
          
          <p className="warning">
            <strong>Note:</strong> These codes will only be shown once. Store them safely.
          </p>
        </div>
        
        <div className="step">
          <h3>Step 3: Verify</h3>
          <p>Enter the 6-digit code from your authenticator app to verify setup:</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleEnable}>
            <div className="form-group">
              <input
                type="text"
                placeholder="6-digit verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="form-control"
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Enable Two-Factor Authentication'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;
