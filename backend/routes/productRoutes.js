const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductAvailability
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

// Permetti accesso pubblico alla rotta GET /api/products
router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, updateProduct);

router.patch('/:id/toggle-availability', protect, toggleProductAvailability);

module.exports = router;