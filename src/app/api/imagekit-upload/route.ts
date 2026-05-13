import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const requestId = `UPLOAD-${Date.now()}`;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(`[${requestId}] File received: ${file.name} (${(file.size / (1024*1024)).toFixed(2)} MB)`);

    // Size Limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "File is too large. Maximum allowed size is 10MB." 
      }, { status: 413 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: "ImageKit configuration error" }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadForm = new FormData();
    uploadForm.append("file", buffer as any, file.name);
    uploadForm.append("fileName", file.name);
    uploadForm.append("useUniqueFileName", "true");

    const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${privateKey}:`).toString("base64"),
      },
      body: uploadForm,
    });

    const data = await uploadRes.json();

    if (!uploadRes.ok) {
      console.error(`[${requestId}] ImageKit Error:`, data);
      return NextResponse.json({ error: data.message || "Upload failed on ImageKit" }, { status: uploadRes.status });
    }

    console.log(`[${requestId}] Upload Success: ${data.url}`);

    return NextResponse.json({
      success: true,
      url: data.url,
      fileId: data.fileId,
      name: data.name,
    });

  } catch (err: any) {
    console.error(`[${requestId}] Server Error:`, err);
    return NextResponse.json({ 
      error: err?.message || "Failed to upload image" 
    }, { status: 500 });
  }
}