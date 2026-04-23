import mongoose, { Schema, Document } from 'mongoose';

export interface IAmenity extends Document {
  name: string;
  icon: string;
}

const AmenitySchema: Schema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true }
});

export default mongoose.models.Amenity || mongoose.model<IAmenity>('Amenity', AmenitySchema);
