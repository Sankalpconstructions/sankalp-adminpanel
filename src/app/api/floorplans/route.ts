import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FloorPlan from "@/models/FloorPlan";

export async function GET() {
  try {
    await connectDB();
    const plans = await FloorPlan.find({});
    return NextResponse.json(plans);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const { id, _id, ...rest } = data;
    const plan = await FloorPlan.create(rest);
    return NextResponse.json(plan, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
