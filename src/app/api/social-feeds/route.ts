import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SocialFeed from "@/models/SocialFeed";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    await connectDB();
    let feeds = await SocialFeed.find({}).sort({ createdAt: -1 });

    // Auto-seed if collection is empty
    // if (feeds.length === 0) {
    //   const initialFeeds = [
    //     { platform: "instagram", embedUrl: "https://www.instagram.com/p/C-reKCXzvT9/", title: "Instagram Post" },
    //     { platform: "instagram", embedUrl: "https://www.instagram.com/p/DEg3xzATRnO/", title: "Instagram Post" },
    //     { platform: "instagram", embedUrl: "https://www.instagram.com/reel/DYkGcZGzjHg/", title: "Instagram Reel" },
    //     { platform: "instagram", embedUrl: "https://www.instagram.com/p/DXyajELkwJ8/", title: "Instagram Post" },
    //     { platform: "instagram", embedUrl: "https://www.instagram.com/p/DXGdBCQk-1T/", title: "Instagram Post" }
    //   ];
    //   await SocialFeed.insertMany(initialFeeds);
    //   feeds = await SocialFeed.find({}).sort({ createdAt: -1 });
    // }

    return NextResponse.json(feeds, { headers: corsHeaders });
  } catch (error: any) {
    console.error("GET social-feeds error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const { platform, embedUrl, title } = data;

    if (!platform || !embedUrl) {
      return NextResponse.json({ error: "Platform and Embed URL are required" }, { status: 400 });
    }

    // Check if feed already exists
    const existing = await SocialFeed.findOne({ embedUrl });
    if (existing) {
      return NextResponse.json({ error: "This URL has already been added to the feed." }, { status: 400 });
    }

    const feed = await SocialFeed.create({ platform, embedUrl, title });
    return NextResponse.json(feed, { status: 201 });
  } catch (error: any) {
    console.error("POST social-feeds error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
