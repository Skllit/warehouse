import mongoose, { Schema, Document } from 'mongoose';

export interface Product extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  price: number;
  costPrice: number;
  sku: string;
  unit: 'pcs' | 'pack' | 'set' | 'others';
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
  tagName: string; // New field for clothing-related tags
}

const productSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    sku: { type: String, required: true },
    unit: {
      type: String,
      enum: ['pcs', 'pack', 'set', 'others'],
      required: true,
    },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    tagName: { type: String, required: false }, // Optional for clothing-related products
  },
  { timestamps: true }
);

export default mongoose.model<Product>('Product', productSchema);
