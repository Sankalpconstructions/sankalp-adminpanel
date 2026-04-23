import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String, required: true }
});

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
