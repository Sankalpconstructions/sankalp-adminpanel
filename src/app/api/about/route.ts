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

export async function GET() {
  await dbConnect();

  try {
    const entries = await AboutContent.find({}).sort({
      createdAt: -1,
    });

    return NextResponse.json(entries, {
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch about content" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    const entry = await AboutContent.create(body);

    return NextResponse.json(entry, {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create about content" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}