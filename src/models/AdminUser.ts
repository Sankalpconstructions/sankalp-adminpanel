import mongoose, { Schema, Document } from "mongoose";

export interface IAdminUser extends Document {
  email: string;
  name?: string;
  photo?: string;
  password?: string;
  otp?: string;
  otpExpiry?: Date;
  region?: string;
  lastLogin?: Date;
}

const AdminUserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, default: "" },
  photo: { type: String, default: "" },
  region: { type: String, default: "" },
  lastLogin: { type: Date },
  password: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
}, { timestamps: true });

export default mongoose.models.AdminUser || mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);
