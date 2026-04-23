import mongoose, { Schema, model, models } from 'mongoose';

const AboutContentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Published',
  },
}, { timestamps: true });

const AboutContent = models.AboutContent || model('AboutContent', AboutContentSchema);

export default AboutContent;
