import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { id, password } = await req.json(); // keeping "id" as parameter name since frontend sends "id"

    const admin = await AdminUser.findOne({ email: id });
    
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid Email or Password. Please try again." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password!);
    
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid Email or Password. Please try again." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("sankalp_admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
