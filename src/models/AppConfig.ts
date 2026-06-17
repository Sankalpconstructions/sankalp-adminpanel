import mongoose, { Schema, Document } from 'mongoose';

export interface IAppConfig extends Document {
  key: string;
  value: boolean;
}

const AppConfigSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Boolean, required: true }
}, {
  timestamps: true
});

if (mongoose.models && mongoose.models.AppConfig) {
  delete mongoose.models.AppConfig;
}

export default mongoose.model<IAppConfig>('AppConfig', AppConfigSchema);
