import mongoose, { Schema, Document } from 'mongoose';

export interface ICSR extends Document {
  title: string;
  date: string;
  time: string;
  shortDesc: string;
  longDesc: string;
  images: string[]; // Array of ImageKit URLs
  youtubeLink?: string;
  instagramLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CSRSchema: Schema = new Schema({
  title: { type: String, default: "" },
  date: { type: String, default: "" },
  time: { type: String, default: "" },
  shortDesc: { type: String, default: "" },
  longDesc: { type: String, default: "" },
  images: { type: [String], default: [] },
  youtubeLink: { type: String, required: false },
  instagramLink: { type: String, required: false }
}, {
  timestamps: true
});

if (mongoose.models.CSR) {
  delete mongoose.models.CSR;
}

delete mongoose.models.CSR;
export default mongoose.models.CSR || mongoose.model<ICSR>('CSR', CSRSchema);
