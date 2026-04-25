import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BrandStory from "@/models/BrandStory";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    await connectDB();
    // We only ever have one brand story, so we find the first one
    let story = await BrandStory.findOne({});
    
    if (!story) {
      // Return a default structure if none exists yet
      return NextResponse.json({
        title: "A Legacy of Trust & Quality",
        subtitle: "Brand Story",
        description: "Since our inception, Sankalp Constructions has been a trusted real estate developer...",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        yearsOfExcellence: "25+",
        stats: [
          { label: "Years of Legacy", value: "25+" },
          { label: "Projects Delivered", value: "19+" },
          { label: "Happy Families", value: "10,000+" }
        ]
      }, { headers: corsHeaders });
    }
    
    return NextResponse.json(story, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    
    // Check if one already exists
    let story = await BrandStory.findOne({});
    
    if (story) {
      // Update existing
      story = await BrandStory.findByIdAndUpdate(story._id, data, { new: true });
    } else {
      // Create new
      story = await BrandStory.create(data);
    }
    
    return NextResponse.json(story, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
