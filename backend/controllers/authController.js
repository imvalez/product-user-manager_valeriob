const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, TWO_FACTOR_APP_NAME } = require('../config/auth');
const speakeasy = require('speakeasy'); // Per generare e verificare i codici TOTP
const QRCode = require('qrcode'); // Per generare QR code
const crypto = require('crypto'); // Per generare codici di backup

// Generate JWT
const generateToken = (id, twoFactorAuthenticated = false) => {
  return jwt.sign({ id, twoFactorAuthenticated }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        twoFactorEnabled: user.twoFactorEnabled,
        token: generateToken(user._id, false)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Se 2FA è abilitata, restituisci solo un token temporaneo
    if (user.twoFactorEnabled) {
      return res.json({
        _id: user._id,
        username: user.username,
        requireTwoFactor: true,
        // Token temporaneo per autenticare la richiesta 2FA
        tempToken: generateToken(user._id, false)
      });
    }

    // Se 2FA non è abilitata, restituisci il token completo
    res.json({
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      twoFactorEnabled: user.twoFactorEnabled,
      token: generateToken(user._id, true)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify 2FA code and complete login
// @route   POST /api/auth/verify-2fa
// @access  Private (with temp token)
const verifyTwoFactor = async (req, res) => {
  const { token } = req.body;
  
  try {
    // L'utente viene dal middleware che verifica il token temporaneo
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verifica il codice TOTP
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 1 // Permette una leggera differenza di tempo
    });
    
    // Verifica anche se è un codice di backup
    const isBackupCode = user.backupCodes.find(
      bc => bc.code === token && !bc.used
    );
    
    if (verified || isBackupCode) {
      // Se è un codice di backup, contrassegnalo come usato
      if (isBackupCode) {
        await User.updateOne(
          { _id: user._id, "backupCodes.code": token },
          { $set: { "backupCodes.$.used": true } }
        );
      }
      
      // Restituisci un token completo
      return res.json({
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        twoFactorEnabled: user.twoFactorEnabled,
        token: generateToken(user._id, true)
      });
    } else {
      return res.status(401).json({ message: 'Invalid authentication code' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Setup 2FA for user
// @route   POST /api/auth/setup-2fa
// @access  Private
const setupTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Genera un secret per TOTP
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `${TWO_FACTOR_APP_NAME}:${user.username}`
    });
    
    // Genera codici di backup
    const backupCodes = [];
    for (let i = 0; i < 6; i++) {
      const code = crypto.randomBytes(4).toString('hex');
      backupCodes.push({ code, used: false });
    }
    
    // Aggiorna l'utente con il nuovo secret (ma non abilitare ancora 2FA)
    user.twoFactorSecret = secret.base32;
    user.backupCodes = backupCodes;
    await user.save();
    
    // Genera QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    
    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      backupCodes: backupCodes.map(bc => bc.code)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Enable 2FA after setup
// @route   POST /api/auth/enable-2fa
// @access  Private
const enableTwoFactor = async (req, res) => {
  const { token } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    
    // Verifica il codice TOTP per confermare che la configurazione è corretta
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 1
    });
    
    if (verified) {
      // Abilita 2FA
      user.twoFactorEnabled = true;
      await user.save();
      
      res.json({
        message: 'Two-factor authentication enabled successfully',
        twoFactorEnabled: true
      });
    } else {
      res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Disable 2FA
// @route   POST /api/auth/disable-2fa
// @access  Private
const disableTwoFactor = async (req, res) => {
  const { token } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: 'Two-factor authentication is not enabled' });
    }
    
    // Verifica il codice TOTP per confermare che l'utente ha accesso all'app di autenticazione
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 1
    });
    
    // Verifica anche se è un codice di backup
    const isBackupCode = user.backupCodes.find(
      bc => bc.code === token && !bc.used
    );
    
    if (verified || isBackupCode) {
      // Se è un codice di backup, contrassegnalo come usato
      if (isBackupCode) {
        await User.updateOne(
          { _id: user._id, "backupCodes.code": token },
          { $set: { "backupCodes.$.used": true } }
        );
      }
      
      // Disabilita 2FA e rimuovi i dati relativi
      user.twoFactorEnabled = false;
      user.twoFactorSecret = null;
      user.backupCodes = [];
      await user.save();
      
      res.json({
        message: 'Two-factor authentication disabled successfully',
        twoFactorEnabled: false
      });
    } else {
      res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -twoFactorSecret');
    
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        twoFactorEnabled: user.twoFactorEnabled
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  setupTwoFactor,
  enableTwoFactor,
  disableTwoFactor,
  verifyTwoFactor
};