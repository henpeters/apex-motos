import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroSlide extends Document {
  title: string;
  subtitle: string;
  image: string;
  video?: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image: { type: String, required: true },
    video: { type: String, default: '' },
    buttonText: { type: String, default: 'Shop Parts' },
    buttonLink: { type: String, default: '/store' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);
