import mongoose, { Schema, Document } from 'mongoose';

export interface ICSR extends Document {
  title: string;
  content: string;
  status: string; // 'Draft', 'Published'
  createdAt: Date;
  updatedAt: Date;
}

const CSRSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, default: 'Published' }
}, {
  timestamps: true
});

export default mongoose.models.CSR || mongoose.model<ICSR>('CSR', CSRSchema);
