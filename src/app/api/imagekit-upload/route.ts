import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
      return NextResponse.json(
        { error: "Missing IMAGEKIT_PRIVATE_KEY" },
        { status: 500 }
      );
    }

    // 🔥 Convert file to base64 (THIS IS THE FIX)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString("base64");

    const uploadRes = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${privateKey}:`).toString("base64"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: base64File,
          fileName: fileName || `upload_${Date.now()}`,
          useUniqueFileName: true,
        }),
      }
    );

    const data = await uploadRes.json();

    if (!uploadRes.ok) {
      return NextResponse.json(
        { error: data },
        { status: uploadRes.status }
      );
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}