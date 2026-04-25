import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadRemark {
  status: string;
  remark: string;
  date: Date;
}

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  project: string;
  message: string;
  status: string; 
  date: string;
  history: ILeadRemark[];
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  project: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'New' },
  date: { type: String, required: true },
  history: [
    {
      status: { type: String },
      remark: { type: String },
      date: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true,
  strict: true // Turn strict mode back ON
});

if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Lead;
}

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
