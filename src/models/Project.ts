import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  location: string;
  type: string;
  description: string;
  status: string;
  amenitiesCount?: string;
  priceStarting?: string;
  image?: string; // Main image, usually banners[0]
  banners: string[];
  highlights: string[];
  priceConfigurations: {
    configuration: string;
    carpetArea: string;
    price: string;
  }[];
  amenities: string[];
  landmarks: {
    type: string;
    text: string;
  }[];
  brochures: {
    name: string;
    url: string;
  }[];
  floorPlans: string[];
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Upcoming' },
  amenitiesCount: { type: String },
  priceStarting: { type: String },
  image: { type: String },
  banners: [{ type: String }],
  highlights: [{ type: String }],
  priceConfigurations: [{
    configuration: { type: String },
    carpetArea: { type: String },
    price: { type: String }
  }],
  amenities: [{ type: String }],
  landmarks: [{
    type: { type: String },
    text: { type: String }
  }],
  brochures: [{
    name: { type: String },
    url: { type: String }
  }],
  floorPlans: [{ type: String }],
  gallery: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
