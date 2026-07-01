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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const minimal = searchParams.get("minimal") === "true";
    const query: any = {};
    if (status) {
      query.status = { $regex: new RegExp(`^${status}$`, "i") };
    }

    let dbQuery = Project.find(query).sort({ createdAt: -1 }).lean();
    if (minimal) {
      dbQuery = dbQuery.select("_id title location type status possessionDate image banners mobileBanners createdAt priceConfigurations");
    }

    const projects = await dbQuery;

    const referer = req.headers.get("referer") || "";
    const isPublicRequest = !referer.includes("/admin");

    const formattedProjects = projects.map(project => {
      const p = project as any;

  const firstGal = p.gallery?.[0];
  const mainImage =
  (typeof firstGal === 'string' ? firstGal : firstGal?.desktop || firstGal?.mobile) ||
  p.floorPlans?.[0] ||
  p.banners?.[0] ||
  "";

(p as any).mainImage = mainImage;

      if (isPublicRequest) {
        // security masking for public

        (p as any).floorPlansCount = p.floorPlans?.length || 0;
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

    if (!status) {
      const statusOrder: Record<string, number> = {
        "upcoming": 1,
        "ongoing": 2,
        "completed": 3
      };

      formattedProjects.sort((a, b) => {
        const orderA = statusOrder[(a.status || "").toLowerCase()] || 99;
        const orderB = statusOrder[(b.status || "").toLowerCase()] || 99;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
    }

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
rest.mobileBanners = (rest.mobileBanners || []).filter(Boolean);

// derive image ALWAYS from backend
rest.image = rest.banners[0] || "";

if (!rest.brochures) rest.brochures = [];
const project = await Project.create(rest);
    return NextResponse.json(project, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
