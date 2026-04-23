import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import Amenity from "@/models/Amenity";
import FloorPlan from "@/models/FloorPlan";
import Lead from "@/models/Lead";
import Testimonial from "@/models/Testimonial";
import Team from "@/models/Team";
import FAQ from "@/models/FAQ";
import Gallery from "@/models/Gallery";
import HeroBanner from "@/models/HeroBanner";
import CSR from "@/models/CSR";
import AboutContent from "@/models/AboutContent";

import { 
  initialProjects, 
  initialBlogs, 
  initialAmenities, 
  initialFloorPlans, 
  initialLeads, 
  initialTestimonials, 
  initialTeam, 
  initialFAQs, 
  initialGallery, 
  initialHeroBanner 
} from "@/lib/mockData";

export async function GET() {
  try {
    await connectDB();

    // Helper functions to remove existing IDs if necessary or just check if empty
    const checkAndSeed = async (Model: any, data: any[]) => {
      const count = await Model.countDocuments();
      if (count === 0) {
        // Remove 'id' field from mock data as Mongo generates _id
        const cleanedData = data.map(({ id, ...rest }) => rest);
        await Model.insertMany(cleanedData);
        return true;
      }
      return false;
    };

    const seeded = {
      projects: await checkAndSeed(Project, initialProjects),
      blogs: await checkAndSeed(Blog, initialBlogs),
      amenities: await checkAndSeed(Amenity, initialAmenities),
      floorPlans: await checkAndSeed(FloorPlan, initialFloorPlans),
      leads: await checkAndSeed(Lead, initialLeads),
      testimonials: await checkAndSeed(Testimonial, initialTestimonials),
      team: await checkAndSeed(Team, initialTeam),
      faqs: await checkAndSeed(FAQ, initialFAQs),
      gallery: await checkAndSeed(Gallery, initialGallery),
      heroBanners: await checkAndSeed(HeroBanner, initialHeroBanner),
      csr: await checkAndSeed(CSR, [
        { title: "Education for All", content: "We built a school in...", status: "Published" },
        { title: "Green Energy Initiative", content: "Solar panels installed...", status: "Published" },
      ]),
      about: await checkAndSeed(AboutContent, [
        { title: "Company History", content: "Sankalp was founded in...", status: "Published" },
        { title: "Our Mission", content: "To deliver premium...", status: "Published" },
      ])
    };

    return NextResponse.json({ message: "Seeding process completed", seeded });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
