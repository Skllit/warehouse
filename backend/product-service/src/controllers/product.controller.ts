import { Request, Response, NextFunction } from 'express';
import ProductService from '../services/product.service';
import Product from '../models/product.model'; 

export class ProductController {
  static async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json({ message: 'Product created successfully', product });
    } catch (error: any) {
      next(error);
    }
  }

  static async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await ProductService.getAllProducts();
      res.status(200).json(products);
    } catch (error: any) {
      next(error);
    }
  }

  static async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) {
           res.status(404).json({ message: 'Product not found' });
           return;
         }
      res.status(200).json(product);
    } catch (error: any) {
      next(error);
    }
  }

  static async getProductsByCompanyId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { companyId } = req.params;
      const products = await ProductService.getProductsByCompany(companyId);

      if (products.length === 0) {
        res.status(404).json({ message: 'No products found for this company' });
        return;
      }

      res.status(200).json(products);
    } catch (error: any) {
      next(error);
    }
  }

  static async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductService.updateProduct(id, req.body);
      
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error: any) {
      next(error);
    }
  }

  static async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductService.deleteProduct(id);
      
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error: any) {
      next(error);
    }
  }

  static async updateProductStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Active', 'Inactive'].includes(status)) {
        res.status(400).json({ message: 'Invalid status value' });
        return;
      }

      const product = await ProductService.updateProductStatus(id, status);
      
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      res.status(200).json({ message: 'Product status updated successfully', product });
    } catch (error: any) {
      next(error);
    }
  }
}
