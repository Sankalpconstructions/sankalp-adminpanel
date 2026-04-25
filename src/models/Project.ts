import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  location: string;
  address?: string;
  type: string;
  description: string;
  status: string;
  possessionDate?: string;
  totalFloors?: string;
  totalUnits?: string;
  rera?: string;
  mapSrc?: string;
  amenitiesCount?: string;
  priceStarting?: string;
  image?: string; 
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
  address: { type: String },
  type: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Upcoming' },
  possessionDate: { type: String },
  totalFloors: { type: String },
  totalUnits: { type: String },
  rera: { type: String },
  mapSrc: { type: String },
  amenitiesCount: { type: String },
  priceStarting: { type: String },
  image: { type: String },
  banners: { type: [String], default: [] },
  highlights: { type: [String], default: [] },
  priceConfigurations: [{
    configuration: { type: String },
    carpetArea: { type: String },
    price: { type: String }
  }],
  amenities: { type: [String], default: [] },
  landmarks: [{
    type: { type: String },
    text: { type: String }
  }],
  brochures: [{
    name: { type: String },
    url: { type: String }
  }],
  floorPlans: { type: [String], default: [] },
  gallery: { type: [String], default: [] }
}, {
  timestamps: true
});

// Force refresh the model in development to avoid "Cast to embedded" errors from cached schemas
if (mongoose.models && mongoose.models.Project) {
  delete mongoose.models.Project;
}

export default mongoose.model<IProject>('Project', ProjectSchema);
