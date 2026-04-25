import mongoose, { Schema, Document } from 'mongoose';

export interface IBrandStory extends Document {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  yearsOfExcellence: string;
  stats: {
    label: string;
    value: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const BrandStorySchema: Schema = new Schema({
  title: { type: String, default: "A Legacy of Trust & Quality" },
  subtitle: { type: String, default: "Brand Story" },
  description: { type: String, required: true },
  image: { type: String, required: true },
  yearsOfExcellence: { type: String, default: "25+" },
  stats: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true }
    }
  ]
}, {
  timestamps: true
});

if (mongoose.models.BrandStory) {
  delete mongoose.models.BrandStory;
}

export default mongoose.models.BrandStory || mongoose.model<IBrandStory>('BrandStory', BrandStorySchema);
