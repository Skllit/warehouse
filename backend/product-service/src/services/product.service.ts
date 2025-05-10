import Product from '../models/product.model';

class ProductService {
  static async createProduct(productData: any) {
    const product = new Product(productData);
    await product.save();
    return product;
  }

  static async getAllProducts() {
    return Product.find();//.populate('companyId');
  }

  static async getProductById(id: string) {
    return Product.findById(id);//.populate('companyId');
  }
  // static async getProductsByCompany(companyId: string) {
  //   return Product.find({ companyId });
  // }
}

export default ProductService;
