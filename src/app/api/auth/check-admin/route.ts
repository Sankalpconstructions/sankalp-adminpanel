import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";

export async function GET() {
  try {
    await connectDB();
    const adminExists = await AdminUser.exists({});
    return NextResponse.json({ exists: !!adminExists });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
