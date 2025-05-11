import Product from '../models/product.model';
import mongoose from 'mongoose';

class ProductService {
  static async createProduct(productData: any) {
    // Format the data according to the model requirements
    const formattedData = {
      ...productData,
      unit: 'pcs', // Force to valid enum value
      status: 'Active',
      price: Number(productData.price),
      costPrice: Number(productData.costPrice),
      companyId: new mongoose.Types.ObjectId(productData.companyId) // Convert string to ObjectId
    };

    console.log('Creating product with data:', formattedData); // Debug log

    if (!formattedData.companyId) {
      throw new Error('Company ID is required');
    }

    try {
      const product = new Product(formattedData);
      await product.save();
      return product;
    } catch (error: any) {
      console.error('Error creating product:', error);
      if (error.name === 'ValidationError') {
        throw new Error(`Validation error: ${error.message}`);
      }
      throw error;
    }
  }

  static async getAllProducts() {
    return Product.find().populate('companyId');
  }

  static async getProductById(id: string) {
    return Product.findById(id).populate('companyId');
  }

  static async getProductsByCompany(companyId: string) {
    return Product.find({ companyId }).populate('companyId');
  }

  static async updateProduct(id: string, productData: any) {
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: productData },
      { new: true }
    ).populate('companyId');
    return product;
  }

  static async deleteProduct(id: string) {
    const product = await Product.findByIdAndDelete(id);
    return product;
  }

  static async updateProductStatus(id: string, status: 'Active' | 'Inactive') {
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).populate('companyId');
    return product;
  }
}

export default ProductService;
