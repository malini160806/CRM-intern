const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProducts).post(protect, createProduct);

module.exports = router;
