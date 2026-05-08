import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IRentalProperty extends Document {
  title: string;
  location: string;
  image: string;
  sqft: string;
  facing: string;
  bhk?: string;
  phone: string;
  whatsapp: string;
  status: "available" | "rented";
  propertyType: "residential" | "commercial";
  createdAt: Date;
  updatedAt: Date;
}

const RentalPropertySchema: Schema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  sqft: { type: String, required: true },
  facing: { type: String, required: true },
  bhk: { type: String }, // Optional, only for residential
  phone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  status: { type: String, enum: ['available', 'rented'], default: 'available' },
  propertyType: { type: String, enum: ['residential', 'commercial'], required: true },
}, {
  timestamps: true
});

if (mongoose.models && mongoose.models.RentalProperty) {
  delete mongoose.models.RentalProperty;
}

export default models.RentalProperty || model<IRentalProperty>('RentalProperty', RentalPropertySchema);
