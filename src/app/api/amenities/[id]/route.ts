import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Amenity from "@/models/Amenity";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();
    const { _id, ...rest } = data;
    const amenity = await Amenity.findByIdAndUpdate(id, rest, { new: true });
    if (!amenity) return NextResponse.json({ error: "Amenity not found" }, { status: 404 });
    return NextResponse.json(amenity);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const amenity = await Amenity.findByIdAndDelete(id);
    if (!amenity) return NextResponse.json({ error: "Amenity not found" }, { status: 404 });
    return NextResponse.json({ message: "Amenity deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
