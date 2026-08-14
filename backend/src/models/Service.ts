import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  active: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    image: { type: String, default: '/media/life-of-pix-cylinders-569151_1920.jpg' },
    price: { type: Number, required: true, min: 0 },
    duration: { type: String, default: '1 - 2 Hours' },
    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IService>('Service', ServiceSchema);
