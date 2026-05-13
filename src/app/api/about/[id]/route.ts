import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AboutContent from "@/models/AboutContent";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await params;

    const entry = await AboutContent.findById(id);

    return NextResponse.json(entry, {
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch entry" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await params;
    const body = await request.json();

    const entry = await AboutContent.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    return NextResponse.json(entry, {
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update entry" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await params;

    await AboutContent.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Deleted successfully" },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete entry" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}