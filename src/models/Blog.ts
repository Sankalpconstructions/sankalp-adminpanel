import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  category: string;
  image: string;
  date: string; 
  summary: string;
  content: string;
  author: string;
  readingTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  readingTime: { type: String, default: '5 min read' }
}, {
  timestamps: true
});

if (mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
