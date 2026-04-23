import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HeroBanner from "@/models/HeroBanner";

export async function GET() {
  try {
    await connectDB();
    const banners = await HeroBanner.find({});
    return NextResponse.json(banners);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const { id, _id, ...rest } = data;
    const banner = await HeroBanner.create(rest);
    return NextResponse.json(banner, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
