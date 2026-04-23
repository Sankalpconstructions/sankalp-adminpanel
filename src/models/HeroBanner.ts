import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroBanner extends Document {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  isActive: boolean;
}

const HeroBannerSchema: Schema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  ctaText: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

export default mongoose.models.HeroBanner || mongoose.model<IHeroBanner>('HeroBanner', HeroBannerSchema);
