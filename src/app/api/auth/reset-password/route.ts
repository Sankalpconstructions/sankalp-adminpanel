import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, otp, newPassword } = body as { email?: string; otp?: string; newPassword?: string };

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Email, OTP and new password are required" }, { status: 400 });
    }

    const admin = await AdminUser.findOne({ email });
    if (!admin || !admin.otp || !admin.otpExpiry) {
      return NextResponse.json({ error: "Invalid OTP or email" }, { status: 400 });
    }

    if (admin.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > new Date(admin.otpExpiry)) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    admin.otp = undefined;
    admin.otpExpiry = undefined as any;
    await admin.save();

    return NextResponse.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, otp, newPassword } = await req.json();

    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid Email" }, { status: 400 });
    }

    if (admin.otp !== otp || !admin.otpExpiry || admin.otpExpiry < new Date()) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();

    return NextResponse.json({ success: true, message: "Password reset successful" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
