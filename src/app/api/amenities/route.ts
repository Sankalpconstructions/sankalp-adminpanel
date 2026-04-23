import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Amenity from "@/models/Amenity";

export async function GET() {
  try {
    await connectDB();
    const amenities = await Amenity.find({});
    return NextResponse.json(amenities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const { id, _id, ...rest } = data;
    const amenity = await Amenity.create(rest);
    return NextResponse.json(amenity, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
