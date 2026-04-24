import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const admin = await AdminUser.findOne({ email });

    // Always return success message (security purpose)
    if (!admin) {
      return NextResponse.json(
        { message: "If that email exists, an OTP has been sent." },
        { status: 200 }
      );
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ⚠️ Important: Re-typed template string (fixes your error)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Admin Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "OTP sent to email.",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}