import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CSR from "@/models/CSR";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();
    const { _id, ...rest } = data;
    const initiative = await CSR.findByIdAndUpdate(id, rest, { new: true });
    if (!initiative) return NextResponse.json({ error: "Initiative not found" }, { status: 404, headers: corsHeaders });
    return NextResponse.json(initiative, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const initiative = await CSR.findByIdAndDelete(id);
    if (!initiative) return NextResponse.json({ error: "Initiative not found" }, { status: 404, headers: corsHeaders });
    return NextResponse.json({ message: "Initiative deleted" }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
