import express, { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = express.Router();

// Create a new product
router.post('/', authMiddleware, (req, res, next) => ProductController.createProduct(req, res, next));

// Get all products
router.get('/', authMiddleware, (req, res, next) => ProductController.getProducts(req, res, next));

// Get product by ID
router.get('/:id', authMiddleware, (req, res, next) => ProductController.getProductById(req, res, next));

// Get products by company ID
router.get('/company/:companyId', authMiddleware, (req, res, next) => ProductController.getProductsByCompanyId(req, res, next));

// Update product
router.put('/:id', authMiddleware, (req, res, next) => ProductController.updateProduct(req, res, next));

// Delete product
router.delete('/:id', authMiddleware, (req, res, next) => ProductController.deleteProduct(req, res, next));

// Update product status
router.patch('/:id/status', authMiddleware, (req, res, next) => ProductController.updateProductStatus(req, res, next));

export default router;
