import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  category: string;
  image: string;
  project: string;
}

const GallerySchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  project: { type: String, required: true }
});

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
