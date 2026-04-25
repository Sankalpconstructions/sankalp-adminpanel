import mongoose, { Schema, Document } from 'mongoose';

export interface ICSR extends Document {
  title: string;
  date: string;
  time: string;
  shortDesc: string;
  longDesc: string;
  images: string[]; // Array of ImageKit URLs
  createdAt: Date;
  updatedAt: Date;
}

const CSRSchema: Schema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  shortDesc: { type: String, required: true },
  longDesc: { type: String, required: true },
  images: { type: [String], default: [] }
}, {
  timestamps: true
});

if (mongoose.models.CSR) {
  delete mongoose.models.CSR;
}

export default mongoose.models.CSR || mongoose.model<ICSR>('CSR', CSRSchema);
