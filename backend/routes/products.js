const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const productValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').trim().notEmpty().withMessage('Description is required')
];

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, upload.single('image'), productValidation, createProduct);
router.put('/:id', protect, upload.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;