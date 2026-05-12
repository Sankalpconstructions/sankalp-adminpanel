import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

async function getAdminFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sankalp_admin_token")?.value;
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET || "dev_secret";
    const payload = jwt.verify(token, secret) as any;
    return payload?.id ? payload.id : null;
  } catch (err) {
    return null;
  }
}

export async function GET() {
  try {
    await connectDB();
    const adminId = await getAdminFromToken();
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await AdminUser.findById(adminId).select("email name photo region lastLogin createdAt updatedAt");
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    return NextResponse.json({ admin });
  } catch (error: any) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const adminId = await getAdminFromToken();
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const updates: any = {};
    if (typeof body.name === "string") updates.name = body.name;
    if (typeof body.photo === "string") updates.photo = body.photo;
    if (typeof body.region === "string") updates.region = body.region;
    let reissueToken = false;
    if (typeof body.email === "string") {
      const newEmail = body.email.trim().toLowerCase();
      const existing = await AdminUser.findOne({ email: newEmail });
      if (existing && existing._id.toString() !== adminId) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
      updates.email = newEmail;
      reissueToken = true;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await AdminUser.findByIdAndUpdate(adminId, { $set: updates }, { new: true }).select("email name photo region lastLogin createdAt updatedAt");
    if (!updated) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    // If email changed, reissue token with new email and set cookie
    if (reissueToken) {
      try {
        const jwtSecret = process.env.JWT_SECRET || "dev_secret";
        const token = jwt.sign({ id: updated._id.toString(), email: updated.email }, jwtSecret, { expiresIn: "8h" });
        const cookieStore = await cookies();
        cookieStore.set("sankalp_admin_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 8,
        });
      } catch (err) {
        console.error("Failed to reissue token after email change:", err);
      }
    }

    return NextResponse.json({ admin: updated });
  } catch (error: any) {
    console.error("Profile PUT Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
