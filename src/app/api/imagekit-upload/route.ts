import { NextRequest, NextResponse } from "next/server";

// Route Segment Config (Modern Way)
export const dynamic = 'force-dynamic';           // Don't cache
export const runtime = 'nodejs';                  // Use Node.js runtime
export const maxDuration = 60;                    // Max 60 seconds

export async function POST(req: NextRequest) {
  const requestId = `UPLOAD-${Date.now()}`;

  console.log(`[${requestId}] Image Upload Request Started`);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    console.log(`[${requestId}] File Info:`, {
      name: file?.name,
      size: file ? (file.size / (1024 * 1024)).toFixed(2) + " MB" : null,
      type: file?.type,
    });

    if (!file) {
      console.error(`[${requestId}] No file received`);
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      console.error(`[${requestId}] File too large: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      return NextResponse.json({ 
        error: "File is too large. Maximum allowed size is 10MB." 
      }, { status: 413 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      console.error(`[${requestId}] IMAGEKIT_PRIVATE_KEY is missing`);
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadForm = new FormData();
    uploadForm.append("file", buffer as any, file.name);
    uploadForm.append("fileName", file.name);
    uploadForm.append("useUniqueFileName", "true");

    console.log(`[${requestId}] Sending to ImageKit...`);

    const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${privateKey}:`).toString("base64"),
      },
      body: uploadForm,
    });

    const data = await uploadRes.json();

    if (!uploadRes.ok) {
      console.error(`[${requestId}] ImageKit Failed:`, data);
      return NextResponse.json({ error: data.message || "Upload failed" }, { status: uploadRes.status });
    }

    console.log(`[${requestId}] ✅ Upload Successful - ${data.url}`);

    return NextResponse.json({
      success: true,
      url: data.url,
      fileId: data.fileId,
      name: data.name,
    });

  } catch (err: any) {
    console.error(`[${requestId}] Critical Error:`, err);
    return NextResponse.json({ 
      error: err?.message || "Failed to upload image" 
    }, { status: 500 });
  }
}