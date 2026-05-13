import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: { bodyParser: false, responseLimit: false },
};

export async function POST(req: NextRequest) {
  const requestId = `REQ-${Date.now()}`;

  console.log(`[${requestId}] Image Upload Started`);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    console.log(`[${requestId}] File received:`, {
      name: file?.name,
      size: file?.size ? (file.size / 1024 / 1024).toFixed(2) + " MB" : null,
      type: file?.type,
    });

    if (!file) {
      console.error(`[${requestId}] No file uploaded`);
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      console.error(`[${requestId}] File too large: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      return NextResponse.json({ error: "File too large. Max 10MB allowed." }, { status: 413 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      console.error(`[${requestId}] IMAGEKIT_PRIVATE_KEY missing`);
      return NextResponse.json({ error: "ImageKit configuration error" }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(`[${requestId}] Sending to ImageKit...`);

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
      console.error(`[${requestId}] ImageKit Upload Failed:`, data);
      return NextResponse.json({ error: data.message || "Upload failed" }, { status: uploadRes.status });
    }

    console.log(`[${requestId}] Upload Successful! URL:`, data.url);

    return NextResponse.json({
      success: true,
      url: data.url,
      fileId: data.fileId,
      name: data.name,
    });

  } catch (err: any) {
    console.error(`[${requestId}] Critical Error:`, err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}