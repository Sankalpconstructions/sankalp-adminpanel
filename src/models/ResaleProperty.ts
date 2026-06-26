import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IResaleProperty extends Document {
  title: string;
  location: string;
  image: string;
  sqft: string;
  facing: string;
  bhk?: string;
  phone: string;
  whatsapp: string;
  status: "available" | "sold";
  propertyType: "residential" | "commercial";
  createdAt: Date;
  updatedAt: Date;
}

const ResalePropertySchema: Schema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  sqft: { type: String, required: true },
  facing: { type: String, required: true },
  bhk: { type: String }, // Optional, only for residential
  phone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  status: { type: String, enum: ['available', 'sold'], default: 'available', index: true },
  propertyType: { type: String, enum: ['residential', 'commercial'], required: true, index: true },
}, {
  timestamps: true
});

ResalePropertySchema.index({ propertyType: 1, createdAt: -1 });
ResalePropertySchema.index({ createdAt: -1 });

if (mongoose.models && mongoose.models.ResaleProperty) {
  delete mongoose.models.ResaleProperty;
}

export default models.ResaleProperty || model<IResaleProperty>('ResaleProperty', ResalePropertySchema);
