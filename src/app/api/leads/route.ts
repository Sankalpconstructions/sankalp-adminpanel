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

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Support for pagination and filtering
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const project = searchParams.get("project");
    const search = searchParams.get("search");
    
    const query: any = {};
    if (status && status !== "All") query.status = status;
    if (project && project !== "All") query.project = project;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    return NextResponse.json(leads, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const { id, _id, ...rest } = data;
    
    // Initialize history if it's a new lead
    const lead = await Lead.create({
      ...rest,
      history: [{
        status: rest.status || "New",
        remark: "Lead generated from website.",
        date: new Date()
      }]
    });
    
    return NextResponse.json(lead, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
