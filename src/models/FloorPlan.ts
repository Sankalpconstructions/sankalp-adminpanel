import mongoose, { Schema, Document } from 'mongoose';

export interface IFloorPlan extends Document {
  type: string;
  area: string;
  img: string;
  project: string;
}

const FloorPlanSchema: Schema = new Schema({
  type: { type: String, required: true },
  area: { type: String, required: true },
  img: { type: String, required: true },
  project: { type: String, required: true }
});

export default mongoose.models.FloorPlan || mongoose.model<IFloorPlan>('FloorPlan', FloorPlanSchema);
