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

import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const cleanId = id.trim();
    let project = null;

    // 1. Try finding by valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(cleanId)) {
      project = await Project.findById(cleanId).lean();
    }

    // 2. Try finding by Title (Case-Insensitive)
    if (!project) {
      const decodedId = decodeURIComponent(cleanId);

      // 2a. Exact match (case insensitive)
      project = await Project.findOne({ title: { $regex: new RegExp(`^${decodedId}$`, 'i') } }).lean();

      // 2b. Hyphens replaced by spaces (case insensitive)
      if (!project) {
        const unsluggedId = decodedId.replace(/-/g, ' ');
        project = await Project.findOne({ title: { $regex: new RegExp(`^${unsluggedId}$`, 'i') } }).lean();
      }
    }

    // 3. Fallback to older static IDs if applicable (e.g., "1", "2")
    if (!project && !isNaN(Number(cleanId))) {
      // Just in case there is some other custom ID mapping, but usually we just return null.
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found", debugId: id, cleanId, length: id.length }, { status: 404, headers: corsHeaders });
    }

    const projectObj = project as any;

    // DETECTION: Check if the request is coming from the Admin Panel or the Public Website
    const referer = req.headers.get("referer") || "";
    // If it's NOT coming from the admin path, we treat it as a public request
    const isPublicRequest = !referer.includes("/admin");

    if (isPublicRequest) {
      // SECURITY: Hide sensitive data for public website only
      (projectObj as any).floorPlansCount = projectObj.floorPlans?.length || 0;

      if (projectObj.priceConfigurations) {
        projectObj.priceConfigurations = projectObj.priceConfigurations.map((pc: any) => ({
          ...pc,
          price: "Price on Request"
        }));
      }
      projectObj.priceStarting = "Price on Request";
    }

    return NextResponse.json(projectObj, { headers: corsHeaders });
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
    // Ensure brochures array exists to avoid accidental omission
    if (!rest.brochures) rest.brochures = [];
    rest.banners = (rest.banners || []).filter(Boolean);
    rest.mobileBanners = (rest.mobileBanners || []).filter(Boolean);

    const project = await Project.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404, headers: corsHeaders });
    }
    return NextResponse.json(project, { headers: corsHeaders });
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
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404, headers: corsHeaders });
    }
    return NextResponse.json({ message: "Project deleted successfully" }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
