import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  category: string;
  image: string;
  date: string; // Storing as string to match existing mock data format, or could be Date
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
