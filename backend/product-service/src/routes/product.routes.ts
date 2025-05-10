import express from 'express';
import { ProductController } from '../controllers/product.controller';

const router = express.Router();

// Create a new product
router.post('/', ProductController.createProduct);

// Get all products
router.get('/', ProductController.getProducts);

// Get product by ID
router.get('/:id', ProductController.getProductById);

router.get('/company/:companyId', ProductController.getProductsByCompanyId);

export default router;
