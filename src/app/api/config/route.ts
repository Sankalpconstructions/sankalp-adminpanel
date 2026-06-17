import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AppConfig from "@/models/AppConfig";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      const configs = await AppConfig.find({});
      const configMap = configs.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      return NextResponse.json(configMap, { headers: corsHeaders });
    }

    let config = await AppConfig.findOne({ key });
    
    // Default to true if the configuration has not been set yet
    if (!config) {
      config = { key, value: true };
    }

    return NextResponse.json(config, { headers: corsHeaders });
  } catch (error: any) {
    console.error("GET config error:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const { key, value } = data;

    if (!key || typeof value !== "boolean") {
      return NextResponse.json({ error: "Key and boolean value are required" }, { status: 400 });
    }

    const config = await AppConfig.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );

    return NextResponse.json(config);
  } catch (error: any) {
    console.error("POST config error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
