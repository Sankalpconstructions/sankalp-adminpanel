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
    
    // 1. Find the lead first
    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404, headers: corsHeaders });
    }

    if (data.reset === true) {
      // REAL WORLD RESET: We don't delete history, we add a "Reset" event
      lead.status = "New";
      lead.history.push({
        status: "New",
        remark: "Status reset to New by Admin.",
        date: new Date()
      });
    } else {
      // NORMAL UPDATE
      lead.status = data.status;
      lead.history.push({
        status: data.status,
        remark: data.remark,
        date: new Date()
      });
    }

    // 2. Explicitly mark history as modified (Crucial for Mongoose arrays)
    lead.markModified('history');
    
    // 3. Save the document
    await lead.save();

    console.log("Lead saved successfully. History count:", lead.history.length);
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
