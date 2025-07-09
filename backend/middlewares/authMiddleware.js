const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const user = await User.findById(decoded.id)
        .select('-password')
        .lean();

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Controllo 2FA
      if (user.twoFactorEnabled && !decoded.twoFactorAuthenticated) {
        return res.status(401).json({
          message: 'Two-factor authentication required',
          requireTwoFactor: true
        });
      }

      // Controllo stato utente
      if (!user.isActive) {
        return res.status(403).json({ message: 'Account disabilitato' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      res.status(401).json({ message: 'Token non valido' });
    }
  } else {
    res.status(401).json({ message: 'Token mancante' });
  }
};

// Middleware per autenticazione temporanea (per verifica 2FA)
const tempAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'User account is inactive or not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      res.status(401).json({ message: 'Token non valido' });
    }
  } else {
    res.status(401).json({ message: 'Token mancante' });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, tempAuth, admin };