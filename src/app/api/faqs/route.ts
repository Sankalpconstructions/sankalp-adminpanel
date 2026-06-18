import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FAQ from "@/models/FAQ";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",           // Change to your domain in production
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// Handle CORS Preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find({}).sort({ order: 1, createdAt: -1 });

    return NextResponse.json(faqs, { 
      headers: corsHeaders 
    });
  } catch (error: any) {
    console.error("FAQ GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    
    const { id, _id, ...rest } = data;
    const faq = await FAQ.create(rest);

    return NextResponse.json(faq, { 
      status: 201, 
      headers: corsHeaders 
    });
  } catch (error: any) {
    console.error("FAQ POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create FAQ" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}