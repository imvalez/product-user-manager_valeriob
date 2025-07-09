const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

// All user routes are protected and require admin access
router.use(protect);
router.use(admin);

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser);

router.patch('/:id/toggle-status', toggleUserStatus);

module.exports = router;