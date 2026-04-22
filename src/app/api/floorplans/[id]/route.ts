import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FloorPlan from "@/models/FloorPlan";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();
    const { _id, ...rest } = data;
    const floorPlan = await FloorPlan.findByIdAndUpdate(id, rest, { new: true });
    if (!floorPlan) return NextResponse.json({ error: "Floor plan not found" }, { status: 404 });
    return NextResponse.json(floorPlan);
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
    const floorPlan = await FloorPlan.findByIdAndDelete(id);
    if (!floorPlan) return NextResponse.json({ error: "Floor plan not found" }, { status: 404 });
    return NextResponse.json({ message: "Floor plan deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
