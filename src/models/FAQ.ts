import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: "General" },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

if (mongoose.models.FAQ) {
  delete mongoose.models.FAQ;
}

export default mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);
