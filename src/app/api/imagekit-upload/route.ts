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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
      return NextResponse.json(
        { error: "Missing IMAGEKIT_PRIVATE_KEY" },
        { status: 500 }
      );
    }

    const uploadForm = new FormData();

    uploadForm.append("file", buffer as any);
    uploadForm.append("fileName", fileName || `upload_${Date.now()}`);
    uploadForm.append("useUniqueFileName", "true");

    const uploadRes = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${privateKey}:`).toString("base64"),
        },
        body: uploadForm as any,
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