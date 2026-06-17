import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialFeed extends Document {
  platform: string; // 'instagram' | 'youtube' | 'facebook' | 'twitter' | 'other'
  embedUrl: string; // The URL of the post/video
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SocialFeedSchema: Schema = new Schema({
  platform: { type: String, required: true },
  embedUrl: { type: String, required: true, unique: true },
  title: { type: String }
}, {
  timestamps: true
});

// Avoid re-compilation model errors in development
if (mongoose.models && mongoose.models.SocialFeed) {
  delete mongoose.models.SocialFeed;
}

export default mongoose.model<ISocialFeed>('SocialFeed', SocialFeedSchema);
