import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SocialFeed from "@/models/SocialFeed";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deleted = await SocialFeed.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Feed item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE social-feed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
