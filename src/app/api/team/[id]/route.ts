import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Team from "@/models/Team";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();
    const { _id, ...rest } = data;
    const teamMember = await Team.findByIdAndUpdate(id, rest, { new: true });
    if (!teamMember) return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    return NextResponse.json(teamMember);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const teamMember = await Team.findByIdAndDelete(id);
    if (!teamMember) return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    return NextResponse.json({ message: "Team member deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
