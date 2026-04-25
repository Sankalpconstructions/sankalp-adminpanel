import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404, headers: corsHeaders });
    return NextResponse.json(blog, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
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
    const blog = await Blog.findByIdAndUpdate(id, rest, { new: true });
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404, headers: corsHeaders });
    return NextResponse.json(blog, { headers: corsHeaders });
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
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404, headers: corsHeaders });
    return NextResponse.json({ message: "Blog deleted" }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
