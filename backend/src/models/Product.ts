import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicleCompatibility {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  notes?: string;
}

export interface IProductSpecification {
  key: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: mongoose.Types.ObjectId | string;
  price: number;
  discountPrice?: number;
  stock: number;
  description: string;
  specifications: IProductSpecification[];
  images: string[];
  compatibility: IVehicleCompatibility[];
  rating: number;
  numReviews: number;
  featured: boolean;
  bestseller: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    description: { type: String, required: true },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    images: [{ type: String, required: true }],
    compatibility: [
      {
        make: { type: String, required: true },
        model: { type: String, required: true },
        yearStart: { type: Number, required: true },
        yearEnd: { type: Number, required: true },
        notes: { type: String, default: '' },
      },
    ],
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    numReviews: { type: Number, default: 12 },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', brand: 'text', sku: 'text', description: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);
