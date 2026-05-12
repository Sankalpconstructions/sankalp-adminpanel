import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, otp } = body as { email?: string; otp?: string };

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid OTP or Email" }, { status: 400 });
    }

    if (admin.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (!admin.otpExpiry || admin.otpExpiry < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // OTP is valid
    return NextResponse.json({ success: true, message: "OTP verified" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
