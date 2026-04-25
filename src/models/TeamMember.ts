import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  role: string;
  image: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

if (mongoose.models.TeamMember) {
  delete mongoose.models.TeamMember;
}

export default mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
