import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  customerName: string;
  customerRole: string;
  customerImage?: string;
  rating: number;
  comment: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    customerRole: { type: String, default: 'Verified Customer' },
    customerImage: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
