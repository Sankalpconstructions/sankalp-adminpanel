import { NextResponse } from "next/server";
import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // 1. We need to find the fileId for this URL first
    // Extract the filename or path from the URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];

    // Search for the file to get its fileId
    const files = await imagekit.files.list({
      name: fileName,
    });

    // Find the exact match in case multiple files have the same name
    const fileToDelete = files.find((f: any) => f.url === imageUrl);

    if (fileToDelete) {
      await imagekit.files.delete(fileToDelete.fileId);
      return NextResponse.json({ success: true, message: "Image deleted from ImageKit" });
    }

    return NextResponse.json({ error: "Image not found on ImageKit" }, { status: 404 });
  } catch (error) {
    console.error("ImageKit delete error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
