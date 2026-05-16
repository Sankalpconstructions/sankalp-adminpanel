import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";

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
    

    const { _id, ...updateData } = data;
    
    // Explicitly update using findOneAndUpdate with $set
    const lead = await Lead.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true, runValidators: false, upsert: false }
    );

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json(lead, { headers: corsHeaders });
  } catch (error: any) {
    console.error("API Update Error:", error);
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
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404, headers: corsHeaders });
    return NextResponse.json({ message: "Lead deleted" }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
