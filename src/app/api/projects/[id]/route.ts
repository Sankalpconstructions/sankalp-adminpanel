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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const project = await Project.findById(id);
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404, headers: corsHeaders });
    }

    const projectObj = project.toObject();

    // DETECTION: Check if the request is coming from the Admin Panel or the Public Website
    const referer = req.headers.get("referer") || "";
    // If it's NOT coming from the admin path, we treat it as a public request
    const isPublicRequest = !referer.includes("/admin");

    if (isPublicRequest) {
      // SECURITY: Hide sensitive data for public website only
      (projectObj as any).floorPlansCount = projectObj.floorPlans?.length || 0;
      projectObj.floorPlans = []; 
      
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
