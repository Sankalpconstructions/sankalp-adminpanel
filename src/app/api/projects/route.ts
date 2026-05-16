import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

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

    const projects = await Project.find({}).sort({ createdAt: -1 });

    const referer = req.headers.get("referer") || "";
    const isPublicRequest = !referer.includes("/admin");

    const formattedProjects = projects.map(project => {
      const p = project.toObject();

  const mainImage =
  p.gallery?.[0] ||
  p.floorPlans?.[0] ||
  p.banners?.[0] ||
  "";

(p as any).mainImage = mainImage;

      if (isPublicRequest) {
        // security masking for public

        (p as any).floorPlansCount = p.floorPlans?.length || 0;
        p.floorPlans = [];
        p.priceStarting = "Price on Request";

        if (p.priceConfigurations) {
          p.priceConfigurations = p.priceConfigurations.map((pc: any) => ({
            ...pc,
            price: "Price on Request",
          }));
        }
      }

      return p;
    });

    return NextResponse.json(formattedProjects, { headers: corsHeaders });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
const { id, _id, ...rest } = data;

rest.banners = (rest.banners || []).filter(Boolean);

// derive image ALWAYS from backend
rest.image = rest.banners[0] || "";

if (!rest.brochures) rest.brochures = [];
const project = await Project.create(rest);
    return NextResponse.json(project, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
