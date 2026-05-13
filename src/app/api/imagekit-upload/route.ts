import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

export const runtime = "nodejs";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await imagekit.upload({
      file: buffer, // 🔥 raw buffer (no base64)
      fileName: file.name,
      useUniqueFileName: true,
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}