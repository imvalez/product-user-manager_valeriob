const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  setupTwoFactor,
  enableTwoFactor,
  disableTwoFactor,
  verifyTwoFactor
} = require('../controllers/authController');
const { protect, tempAuth } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// 2FA verify (con token temporaneo)
router.post('/verify-2fa', tempAuth, verifyTwoFactor);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.post('/setup-2fa', protect, setupTwoFactor);
router.post('/enable-2fa', protect, enableTwoFactor);
router.post('/disable-2fa', protect, disableTwoFactor);

module.exports = router;