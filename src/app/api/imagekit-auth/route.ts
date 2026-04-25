import { NextResponse } from "next/server";
import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
});

export async function GET() {
  try {
    // In @imagekit/nodejs v7+, helper methods are under the .helper property
    const result = imagekit.helper.getAuthenticationParameters();
    return NextResponse.json(result);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 });
  }
}
