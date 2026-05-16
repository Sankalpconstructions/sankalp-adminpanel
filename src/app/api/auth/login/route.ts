import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const email = (body.id || body.email || "") as string;
    const password = (body.password || "") as string;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // If no admin exists yet, seed from env
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await AdminUser.create({ email: process.env.ADMIN_EMAIL, password: hashed });
    }

    const admin = await AdminUser.findOne({ email });
    if (!admin || !admin.password) {
      return NextResponse.json({ error: "Invalid Email or Password. Please try again." }, { status: 401 });
    }

    const pwdMatch = await bcrypt.compare(password, admin.password);
    if (!pwdMatch) {
      return NextResponse.json({ error: "Invalid Email or Password. Please try again." }, { status: 401 });
    }

    // Update lastLogin timestamp
    try {
      admin.lastLogin = new Date();
      await admin.save();
    } catch (err) {
      console.error("Failed to update lastLogin:", err);
    }

    const jwtSecret = process.env.JWT_SECRET || "dev_secret";
    const token = jwt.sign({ id: admin._id.toString(), email: admin.email }, jwtSecret, { expiresIn: "8h" });

    const cookieStore = await cookies();
    cookieStore.set("sankalp_admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    cookieStore.set("sankalp_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


