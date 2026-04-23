import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CSR from "@/models/CSR";

export async function GET() {
  try {
    await connectDB();
    const initiatives = await CSR.find({}).sort({ createdAt: -1 });
    return NextResponse.json(initiatives);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const { id, _id, ...rest } = data;
    const initiative = await CSR.create(rest);
    return NextResponse.json(initiative, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
