import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const bhk = searchParams.get("bhk");
    const priceRange = searchParams.get("priceRange");
    const getConfigs = searchParams.get("getConfigs");

    // ====================== DYNAMIC BHK CONFIGURATIONS ======================
    if (getConfigs === "true") {
      const projects = await Project.find({
        type: { $regex: /apartment/i },   // Case insensitive
        status: { $ne: "Completed" }
      }).select("priceConfigurations");

      const configSet = new Set<string>();

      projects.forEach((proj) => {
        if (Array.isArray(proj.priceConfigurations)) {
          proj.priceConfigurations.forEach((config: any) => {
            if (config?.configuration?.trim()) {
              configSet.add(config.configuration.trim());
            }
          });
        }
      });

      let configurations = Array.from(configSet).sort();

      // Fallback if no data found
      if (configurations.length === 0) {
        configurations = ["2 BHK", "3 BHK", "4 BHK", "5 BHK"];
      }

      return NextResponse.json({
        success: true,
        configurations,
      }, { headers: corsHeaders });
    }

    // ====================== FILTERED PROJECTS ======================
    let query: any = {};
    if (type) {
      query.type = { $regex: type, $options: "i" };
    }
    query.status = { $ne: "Completed" };

    const projectsData = await Project.find(query)
      .select("title type location status priceStarting priceConfigurations image")
      .sort({ createdAt: -1 });

    let filtered = projectsData.map(p => p.toObject());

    // BHK Filter
    if (bhk) {
      filtered = filtered.filter(p =>
        p.priceConfigurations?.some((c: any) =>
          c?.configuration?.toLowerCase().includes(bhk.toLowerCase())
        )
      );
    }

    // Price Range Filter
    if (priceRange) {
      filtered = filtered.filter(p =>
        p.priceConfigurations?.some((c: any) => {
          if (!c?.price || c.price.includes("Request")) return false;
          const price = parseFloat(c.price.replace(/[^0-9.]/g, "")) || 0;
          
          switch (priceRange) {
            case "1.5-2.0": return price <= 2.0;
            case "2.0-2.5": return price > 2.0 && price <= 2.5;
            case "2.5-3.0": return price > 2.5 && price <= 3.0;
            case "1.5-2.5": return price <= 2.5;
            case "2.5-3.5": return price > 2.5 && price <= 3.5;
            case "3.5-5.0": return price > 3.5 && price <= 5.0;
            case "5.0-10.0": return price > 5.0 && price <= 10.0;
            default: return true;
          }
        })
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      projects: filtered,
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}